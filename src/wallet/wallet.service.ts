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
import { UpdateWalletInput } from './dto/update-wallet.input';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    private readonly userService: UserService,
  ) {}

  async create(createWalletInput: CreateWalletInput): Promise<WalletEntity> {
    try {
      const { name, symbol, amount, userId } = createWalletInput;

      const user = await this.userService.findUserById(userId);

      const wallet = this.walletRepository.create({
        WL_Name: name,
        WL_Symbol: symbol,
        WL_Amount: amount,
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

  update(id: number, updateWalletInput: UpdateWalletInput) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
