// Libs
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
} from '@nestjs/graphql';
import { Inject, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';

// Entity import
import { WalletEntity } from 'src/entities/wallet.entity';

// Service injected import
import { WalletService } from './wallet.service';

// Query Input Graph API importing
import { CreateWalletInput } from './dto/create-wallet.input';
import { DepositWalletInput } from './dto/deposit-wallet.input';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => WalletEntity)
export class WalletResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly walletService: WalletService,
  ) {}

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

  @Subscription(() => [WalletEntity], {
    name: 'walletOfUser',
  })
  subscribeWallet() {
    return this.pubSub.asyncIterator('walletOfUser');
  }

  @Query(() => [WalletEntity], { name: 'walletOfUser' })
  async getWalletOfUser(
    @Args(
      'userId',
      { type: () => String, nullable: false },
      new ParseUUIDPipe(),
    )
    userId: string,
  ) {
    const wallets = await this.walletService.getWalletOfUser(userId);
    this.pubSub.publish('walletOfUser', {
      walletOfUser: wallets,
    });
    return wallets;
  }

  @Mutation(() => WalletEntity)
  async depositWallet(
    @Args('depositWalletInput') depositWalletInput: DepositWalletInput,
  ): Promise<WalletEntity> {
    const depositedWallet: any = await this.walletService.depositWallet(
      depositWalletInput,
    );
    await this.getWalletOfUser(depositedWallet.userUSId);
    return depositedWallet;
  }

  @Mutation(() => WalletEntity, { name: 'removeWallet' })
  removeWallet(
    @Args('walletId', { type: () => Int, nullable: false }) walletId: number,
  ): Promise<WalletEntity> {
    return this.walletService.removeWallet(walletId);
  }
}
