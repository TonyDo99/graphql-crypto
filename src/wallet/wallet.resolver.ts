// Libs
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';

// Entity import
import { WalletEntity } from 'src/entities/wallet.entity';

// Service injected import
import { WalletService } from './wallet.service';

// Query Input Graph API importing
import { CreateWalletInput } from './dto/create-wallet.input';
import { UpdateWalletInput } from './dto/update-wallet.input';

@Resolver(() => WalletEntity)
export class WalletResolver {
  constructor(private readonly walletService: WalletService) {}

  @Mutation(() => WalletEntity)
  createWallet(
    @Args('createWalletInput') createWalletInput: CreateWalletInput,
  ) {
    return this.walletService.create(createWalletInput);
  }

  @Query(() => [WalletEntity], { name: 'wallet' })
  findAll(): Promise<WalletEntity[]> {
    return this.walletService.findWallets();
  }

  @Query(() => WalletEntity, { name: 'wallet' })
  findOne(
    @Args('walletId', { type: () => Int }, new ParseIntPipe()) walletId: number,
  ) {
    return this.walletService.findOneById(walletId);
  }

  @Mutation(() => WalletEntity)
  updateWallet(
    @Args('updateWalletInput') updateWalletInput: UpdateWalletInput,
  ) {
    return this.walletService.update(updateWalletInput.id, updateWalletInput);
  }

  @Mutation(() => WalletEntity)
  removeWallet(@Args('id', { type: () => Int }) id: number) {
    return this.walletService.remove(id);
  }
}
