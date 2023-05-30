// LIBS
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// IMPORT ENTITIES MODELS
import { WalletEntity } from 'src/entities/wallet.entity';

// IMPORT SERVICES
import { UserService } from 'src/user/user.service';

// QUERY INPUT GRAPH API IMPORTING
import { CreateWalletInput } from './dto/create-wallet.input';
import { DepositWalletInput } from './dto/update-wallet.input';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    private readonly userService: UserService,
  ) {}

  async create(createWalletInput: CreateWalletInput): Promise<WalletEntity> {
    try {
      const { name, currency, amount, userId, imageUrl } = createWalletInput;

      const user = await this.userService.findUserById(userId);

      const wallet = this.walletRepository.create({
        WL_Name: name,
        WL_Currency: currency,
        WL_Amount: amount,
        WL_Image: imageUrl,
        user,
      });

      return this.walletRepository.save(wallet);
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  findWallets(): Promise<WalletEntity[]> {
    try {
      return this.walletRepository.find({});
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  async findOneById(walletId: number): Promise<WalletEntity> {
    try {
      const wallet = await this.walletRepository.findOneBy({
        WL_Id: walletId,
      });

      if (!wallet)
        throw new NotFoundException('This wallet was not create yet !');

      return wallet;
    } catch (error) {
      throw new BadRequestException(error, { cause: error.message });
    }
  }

  async depositWallet(
    depositWalletInput: DepositWalletInput,
  ): Promise<WalletEntity> {
    try {
      const { amount, walletId } = depositWalletInput;

      const wallet = await this.walletRepository
        .createQueryBuilder()
        .update(WalletEntity)
        .set({
          WL_Amount: () => `"WL_Amount" + ${amount}`,
        })
        .where('WL_Id = :WL_Id', { WL_Id: walletId })
        .returning('*')
        .execute();

      return wallet.raw[0];
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  async removeWallet(walletId: number): Promise<WalletEntity> {
    try {
      await this.findOneById(walletId);

      const deletedWallet = await this.walletRepository
        .createQueryBuilder()
        .delete()
        .from(WalletEntity)
        .where('WL_Id = :walletId', { walletId })
        .returning('*')
        .execute();

      return deletedWallet.raw[0];
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }
}
