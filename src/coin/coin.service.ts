// Libs
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository, DataSource } from 'typeorm';
import { Cache } from 'cache-manager';
import axios from 'axios';

// Service import
import { UserService } from 'src/user/user.service';

// Query Input Graph API importing
import { BuyCoinInput } from './dto/buy-coin.input';

// Entity import
import { CoinEntity } from 'src/entities/coin.entity';
import { UserEntity } from 'src/entities/user.entity';
import { WalletEntity } from 'src/entities/wallet.entity';
import { HistoryEntity } from 'src/entities/history.entity';

// Types import
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

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private readonly dataSource: DataSource,

    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<CoinEntity[]> {
    try {
      const coinsCache: CoinEntity[] = await this.cacheManager.get('coins');

      if (!coinsCache) {
        const coins = await this.coinRepository.find({
          order: {
            CN_Rank: 'ASC',
          },
        });
        await this.cacheManager.set('coins', coins, 0);
        return coins;
      }
      return coinsCache;
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  async findOne(coinId: string): Promise<CoinEntity> {
    try {
      const coin = await this.coinRepository.findOneBy({
        CN_Id: coinId,
      });

      return coin;
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  async buyCoin({
    coinId,
    money,
    quantity,
    currency,
    userId,
  }: BuyCoinInput): Promise<HistoryEntity> {
    try {
      const user = await this.userService.findUserById(userId);

      const hasWallet = await this.userRepository.findOne({
        relations: {
          wallets: true,
        },
        where: {
          US_Id: userId,
          wallets: {
            WL_Currency: currency,
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
