import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsUppercase } from 'class-validator';

@InputType()
export class CreateCoinInput {
  @Field(() => String, { description: 'Coin name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, { description: 'Coin symbol' })
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  symbol: string;

  @Field(() => String, { description: 'Coin name' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @Field(() => Number, { description: 'price base on usd of coin market' })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
