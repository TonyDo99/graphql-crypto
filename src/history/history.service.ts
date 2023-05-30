// LIBS
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// IMPORT ENTITIES MODELS
import { HistoryEntity } from 'src/entities/history.entity';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>,
  ) {}

  histories(): Promise<HistoryEntity[]> {
    try {
      return this.historyRepository.find({});
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  async findOneById(historyId: string): Promise<HistoryEntity> {
    try {
      const history = await this.historyRepository.findOneBy({
        HSR_id: historyId,
      });

      return history;
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }
}
