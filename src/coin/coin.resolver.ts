// Libs
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';

// Service injected import
import { CoinService } from './coin.service';

// Query Input Graph API importing
import { BuyCoinInput } from './dto/buy-coin.input';

// Entity import
import { CoinEntity } from 'src/entities/coin.entity';
import { HistoryEntity } from 'src/entities/history.entity';

@Resolver(() => CoinEntity)
export class CoinResolver {
  constructor(private readonly coinService: CoinService) {}

  @Query(() => [CoinEntity], { name: 'coins', nullable: true })
  async findAll(): Promise<CoinEntity[]> {
    return this.coinService.findAll();
  }

  @Query(() => CoinEntity, { name: 'coin' })
  findOne(
    @Args(
      'coinId',
      { type: () => String, nullable: false },
      new ParseUUIDPipe(),
    )
    coinId: string,
  ): Promise<CoinEntity> {
    return this.coinService.findOne(coinId);
  }

  @Mutation(() => HistoryEntity)
  buyCoin(
    @Args('buyCoinInput') buyCoinInput: BuyCoinInput,
  ): Promise<HistoryEntity> {
    return this.coinService.buyCoin(buyCoinInput);
  }
}
