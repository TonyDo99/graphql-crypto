import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCoinInput } from './dto/create-coin.input';
import { UpdateCoinInput } from './dto/update-coin.input';
import { BuyCoinInput } from './dto/buy-coin.input';
import { InjectRepository } from '@nestjs/typeorm';
import { CoinEntity } from 'src/entities/coin.entity';
import { Repository, DataSource } from 'typeorm';

import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/entities/user.entity';
import { WalletEntity } from 'src/entities/wallet.entity';
import { HistoryEntity } from 'src/entities/history.entity';
import { IResConvertCurrency } from 'src/wallet/types/converted';

@Injectable()
export class CoinService {
  constructor(
    @InjectRepository(CoinEntity)
    private readonly coinRepository: Repository<CoinEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,

    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>,

    private readonly dataSource: DataSource,

    private readonly userService: UserService,
  ) {}

  findAll(): Promise<CoinEntity[]> {
    try {
      return this.coinRepository.find({});
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} coin`;
  }

  remove(id: number) {
    return `This action removes a #${id} coin`;
  }

  async buyCoin({ coinId, money, quantity, currency, userId }: BuyCoinInput) {
    try {
      const user = await this.userService.findUserById(userId);

      const hasWallet = await this.userRepository.findOne({
        relations: {
          wallets: true,
        },
        where: {
          US_Id: userId,
          wallets: {
            WL_Symbol: currency,
          },
        },
      });

      if (!hasWallet)
        throw new NotFoundException(
          'This wallet was not create. Please create wallet before buy coins.',
        );

      const coin = await this.coinRepository.findOneBy({
        CN_Id: coinId,
      });

      if (!coin)
        throw new NotFoundException(
          'This coin are not available right now. Please try with another coin !',
        );

      const { data }: { data: IResConvertCurrency } = await axios.get(
        `${process.env.NINJA_CONVERT_URL}`,
        {
          params: {
            have: currency,
            want: 'USD',
            amount: hasWallet.wallets[0].WL_Amount,
          },
        },
      );

      if (data.error) throw new BadRequestException(data.error);

      if (data.new_amount < coin.CN_Price)
        throw new BadRequestException(
          'Wallet are not enough money to buy this coin !',
        );

      const hasLeft = await axios.get(`${process.env.NINJA_CONVERT_URL}`, {
        params: {
          have: 'USD',
          want: currency,
          amount: data.new_amount - coin.CN_Price,
        },
      });

      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();

      await queryRunner.startTransaction();

      try {
        const insertedHistory = queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(HistoryEntity)
          .values({
            HSR_symbol: coin.CN_Symbol,
            HSR_currency: currency,
            HSR_paid: money,
            HSR_quantity: quantity,
            user,
          })
          .execute();

        const updatedWallet = queryRunner.manager
          .createQueryBuilder()
          .update(WalletEntity)
          .set({
            WL_Amount: hasLeft.data.new_amount,
          })
          .where('WL_Id = :walletId', { walletId: hasWallet.wallets[0].WL_Id })
          .execute();

        await Promise.all([insertedHistory, updatedWallet]);

        await queryRunner.commitTransaction();
      } catch (error) {
        console.error(
          '🚀 ~ file: coin.service.ts:148 ~ CoinService ~ buyCoin ~ error:',
          error,
        );
        await queryRunner.rollbackTransaction();
      } finally {
        console.log('done transaction');

        await queryRunner.release();

        const latestHistory = this.historyRepository
          .createQueryBuilder()
          .select('hsr')
          .from(HistoryEntity, 'hsr')
          .orderBy('hsr.created_at', 'DESC')
          .getOne();

        return latestHistory;
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST, {
        cause: error.message,
      });
    }
  }
}
