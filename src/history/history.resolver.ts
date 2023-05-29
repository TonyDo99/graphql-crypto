import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HistoryService } from './history.service';
import { CreateHistoryInput } from './dto/create-history.input';
import { UpdateHistoryInput } from './dto/update-history.input';
import { HistoryEntity } from 'src/entities/history.entity';

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

  @Mutation(() => HistoryEntity)
  updateHistory(
    @Args('updateHistoryInput') updateHistoryInput: UpdateHistoryInput,
  ) {
    return this.historyService.update(
      updateHistoryInput.id,
      updateHistoryInput,
    );
  }

  @Mutation(() => HistoryEntity)
  removeHistory(@Args('id', { type: () => Int }) id: number) {
    return this.historyService.remove(id);
  }
}
