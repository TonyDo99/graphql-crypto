// LIBS
import { Module } from '@nestjs/common';

// IMPORT SERVICES
import { HistoryService } from './history.service';

// QUERY INPUT GRAPH API IMPORTING
import { HistoryResolver } from './history.resolver';

@Module({
  providers: [HistoryResolver, HistoryService],
})
export class HistoryModule {}
