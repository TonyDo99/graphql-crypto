import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

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

  @Field(() => Int, { description: 'wallet id' })
  @IsNotEmpty()
  @IsNumber()
  walletId: number;

  @Field(() => Int, { description: 'quantity coin buy' })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  quantity: number;
}
