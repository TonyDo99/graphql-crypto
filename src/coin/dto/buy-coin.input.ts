import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { CURRENCY } from 'src/wallet/types/currency';

@InputType()
export class BuyCoinInput {
  @Field(() => String, { description: 'coin id' })
  @IsNotEmpty()
  @IsUUID()
  coinId: string;

  @Field(() => String, { description: 'user id' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @Field(() => Int, { description: 'quantity coin buy' })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  quantity: number;

  @Field(() => Float, { description: 'money buy' })
  @IsNotEmpty()
  @IsNumber()
  money: number;

  @Field(() => String, { description: 'currency money' })
  @IsNotEmpty()
  @IsEnum(CURRENCY)
  currency: CURRENCY;
}
