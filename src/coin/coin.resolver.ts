import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoinService } from './coin.service';
import { CreateCoinInput } from './dto/create-coin.input';
import { UpdateCoinInput } from './dto/update-coin.input';
import { CoinEntity } from 'src/entities/coin.entity';
import { HistoryEntity } from 'src/entities/history.entity';
import { BuyCoinInput } from './dto/buy-coin.input';

@Resolver(() => CoinEntity)
export class CoinResolver {
  constructor(private readonly coinService: CoinService) {}

  @Query(() => [CoinEntity], { name: 'coins', nullable: true })
  findAll(): Promise<CoinEntity[]> {
    return this.coinService.findAll();
  }

  @Query(() => CoinEntity, { name: 'coin' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.coinService.findOne(id);
  }

  @Mutation(() => CoinEntity)
  removeCoin(@Args('id', { type: () => Int }) id: number) {
    return this.coinService.remove(id);
  }

  @Mutation(() => HistoryEntity)
  buyCoin(@Args('buyCoinInput') buyCoinInput: BuyCoinInput) {
    return this.coinService.buyCoin(buyCoinInput);
  }
}
