// LIBS
import { Module } from '@nestjs/common';

// IMPORT SERVICES
import { HistoryService } from './history.service';

// QUERY INPUT GRAPH API IMPORTING
import { HistoryResolver } from './history.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntity } from 'src/entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryEntity])],
  providers: [HistoryResolver, HistoryService],
})
export class HistoryModule {}
