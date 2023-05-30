// LIBS
import { Resolver, Query, Args } from '@nestjs/graphql';

// IMPORT ENTITIES MODELS
import { HistoryEntity } from 'src/entities/history.entity';

// IMPORT SERVICES
import { HistoryService } from './history.service';

@Resolver(() => HistoryEntity)
export class HistoryResolver {
  constructor(private readonly historyService: HistoryService) {}

  @Query(() => [HistoryEntity], { name: 'histories' })
  findAll(): Promise<HistoryEntity[]> {
    return this.historyService.histories();
  }

  @Query(() => HistoryEntity, { name: 'historyDetail' })
  findOne(
    @Args('historyId', { type: () => String }) historyId: string,
  ): Promise<HistoryEntity> {
    return this.historyService.findOneById(historyId);
  }
}
