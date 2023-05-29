// LIBS
import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'name of user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => Int, { description: 'age of user' })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Max(150)
  @Min(18)
  age: number;

  @Field(() => String, { description: 'email of user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'password of user' })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
