// LIBS
import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

@InputType()
export class LoginUserInput {
  @Field(() => String, { description: 'email login' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => String, { description: 'password login' })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}

// @ObjectType()
// export class LoginUserOutput {
//   @Field(() => Boolean, { description: 'status response' })
//   status: boolean;

//   @Field(() => String, { description: 'message response' })
//   message: string;
// }
