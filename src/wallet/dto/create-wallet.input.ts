import { InputType, Field } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  IsUrl,
  Min,
} from 'class-validator';
import { CURRENCY } from '../types/currency';

@InputType()
export class CreateWalletInput {
  @Field(() => String, { description: 'Name in wallet' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => CURRENCY, {
    description: 'symbol in wallet',
  })
  @IsNotEmpty()
  @IsEnum(CURRENCY, {
    message: 'This currency are not support in this moment !',
  })
  currency: CURRENCY;

  @Field(() => Number, { description: 'Money in wallet' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  amount: number;

  @Field(() => String, { description: 'currency image in wallet' })
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;

  @Field(() => String, { description: 'user id' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
