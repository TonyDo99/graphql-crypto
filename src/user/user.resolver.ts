// LIBS
import { Resolver, Query, Mutation, Args, Parent } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { DeleteResult } from 'typeorm';

// IMPORT ENTITIES MODELS
import { UserEntity } from '../entities/user.entity';

// IMPORT SERVICES
import { UserService } from './user.service';

// QUERY INPUT GRAPH API IMPORTING
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { WalletEntity } from 'src/entities/wallet.entity';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserEntity)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<UserEntity> {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => UserEntity)
  deleteUser(
    @Args(
      'userId',
      { type: () => String, nullable: false },
      new ParseUUIDPipe(),
    )
    userId: string,
  ): Promise<DeleteResult> {
    return this.userService.remove(userId);
  }

  @Query(() => [UserEntity], { name: 'user' })
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Query(() => UserEntity, { name: 'userId' })
  findOne(
    @Args(
      'userId',
      { type: () => String, nullable: false },
      new ParseUUIDPipe(),
    )
    userId: string,
  ): Promise<UserEntity> {
    return this.userService.findUserById(userId);
  }

  @Mutation(() => UserEntity)
  login(@Args('loginInput') loginInput: LoginUserInput): Promise<UserEntity> {
    return this.userService.login(loginInput);
  }
}
