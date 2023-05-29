// LIBS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// IMPORT ENTITIES MODELS
import { UserEntity } from '../entities/user.entity';

// IMPORT SERVICES
import { UserService } from './user.service';

// QUERY INPUT GRAPH API IMPORTING
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
