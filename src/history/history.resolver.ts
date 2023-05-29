// LIBS
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

// IMPORT ENTITIES MODELS
import { HistoryEntity } from 'src/entities/history.entity';

// IMPORT SERVICES
import { HistoryService } from './history.service';

// QUERY INPUT GRAPH API IMPORTING
import { CreateHistoryInput } from './dto/create-history.input';

@Resolver(() => HistoryEntity)
export class HistoryResolver {
  constructor(private readonly historyService: HistoryService) {}

  @Mutation(() => HistoryEntity)
  createHistory(
    @Args('createHistoryInput') createHistoryInput: CreateHistoryInput,
  ) {
    return this.historyService.create(createHistoryInput);
  }

  @Query(() => [HistoryEntity], { name: 'history' })
  findAll() {
    return this.historyService.findAll();
  }

  @Query(() => HistoryEntity, { name: 'history' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.historyService.findOne(id);
  }
}
