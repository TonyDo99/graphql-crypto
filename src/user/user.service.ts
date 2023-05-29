// LIBS
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

// IMPORT ENTITIES MODELS
import { UserEntity } from 'src/entities/user.entity';

// QUERY INPUT GRAPH API IMPORTING
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<UserEntity> {
    try {
      const { name, age, email, password } = createUserInput;

      const exist = await this.userRepository.findOneBy({
        US_Email: email,
      });

      if (exist) throw new BadRequestException('This email already been used.');

      const user = this.userRepository.create({
        US_Name: name,
        US_Age: age,
        US_Email: email,
        US_Password: password,
      });

      return this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  findAll(): Promise<UserEntity[]> {
    try {
      return this.userRepository.find({
        relations: {
          wallets: true,
          histories: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  async findUserById(userId: string): Promise<UserEntity> {
    try {
      const exists = await this.userRepository.findOne({
        relations: {
          wallets: true,
          histories: true,
        },
        where: {
          US_Id: userId,
        },
      });

      if (!exists) throw new NotFoundException('User is not exist !');

      return exists;
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  async remove(userId: string): Promise<DeleteResult> {
    try {
      await this.findUserById(userId);

      const deleted = this.userRepository
        .createQueryBuilder()
        .delete()
        .from(UserEntity)
        .where('US_Id = :userId', { userId })
        .execute();

      return deleted;
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }

  async login({ email, password }: LoginUserInput): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({
        US_Email: email,
        US_Password: password,
      });

      if (!user)
        throw new NotFoundException(
          'Wrong email or password. Pls check your account and try again.',
        );

      return user;
    } catch (error) {
      throw new BadRequestException(error, {
        cause: error.message,
      });
    }
  }
}
