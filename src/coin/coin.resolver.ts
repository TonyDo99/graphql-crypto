import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CoinService } from './coin.service';
import { CoinEntity } from 'src/entities/coin.entity';
import { HistoryEntity } from 'src/entities/history.entity';
import { BuyCoinInput } from './dto/buy-coin.input';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => CoinEntity)
export class CoinResolver {
  constructor(private readonly coinService: CoinService) {}

  @Query(() => [CoinEntity], { name: 'coins', nullable: true })
  findAll(): Promise<CoinEntity[]> {
    return this.coinService.findAll();
  }

  @Query(() => CoinEntity, { name: 'coin' })
  findOne(
    @Args('coinId', { type: () => String, nullable: true }, new ParseUUIDPipe())
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
