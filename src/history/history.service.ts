// LIBS
import { Injectable } from '@nestjs/common';

// QUERY INPUT GRAPH API IMPORTING
import { CreateHistoryInput } from './dto/create-history.input';

@Injectable()
export class HistoryService {
  create(createHistoryInput: CreateHistoryInput) {
    return 'This action adds a new history';
  }

  findAll() {
    return `This action returns all history`;
  }

  findOne(id: number) {
    return `This action returns a #${id} history`;
  }
}
