import { InputType, Field } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { CURRENCY } from '../types/currency';

@InputType()
export class CreateWalletInput {
  @Field(() => String, { description: 'Name in wallet' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, { description: 'symbol in wallet' })
  @IsNotEmpty()
  @IsString()
  @IsEnum(CURRENCY, { message: 'This currency is not available !' })
  symbol: string;

  @Field(() => Number, { description: 'Money in wallet' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  amount: number;

  @Field(() => String, { description: 'user id' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
