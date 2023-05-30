import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class DepositWalletInput {
  @Field(() => Number, { description: 'Amount need to deposit' })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @Field(() => Int, { description: 'wallet id' })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  walletId: number;
}
