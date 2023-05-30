// Libs
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';

// Entity import
import { WalletEntity } from 'src/entities/wallet.entity';

// Service injected import
import { WalletService } from './wallet.service';

// Query Input Graph API importing
import { CreateWalletInput } from './dto/create-wallet.input';
import { DepositWalletInput } from './dto/update-wallet.input';

@Resolver(() => WalletEntity)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Mutation(() => WalletEntity)
  createWallet(
    @Args('createWalletInput') createWalletInput: CreateWalletInput,
  ): Promise<WalletEntity> {
    return this.walletService.create(createWalletInput);
  }

  @Query(() => [WalletEntity], { name: 'wallets' })
  findAll(): Promise<WalletEntity[]> {
    return this.walletService.findWallets();
  }

  @Query(() => WalletEntity, { name: 'findWalletById' })
  findOne(
    @Args('walletId', { type: () => Int, nullable: false }, new ParseIntPipe())
    walletId: number,
  ): Promise<WalletEntity> {
    return this.walletService.findOneById(walletId);
  }

  @Mutation(() => WalletEntity)
  depositWallet(
    @Args('depositWalletInput') depositWalletInput: DepositWalletInput,
  ): Promise<WalletEntity> {
    return this.walletService.depositWallet(depositWalletInput);
  }

  @Mutation(() => WalletEntity, { name: 'removeWallet' })
  removeWallet(
    @Args('walletId', { type: () => Int, nullable: false }) walletId: number,
  ): Promise<WalletEntity> {
    return this.walletService.removeWallet(walletId);
  }
}
