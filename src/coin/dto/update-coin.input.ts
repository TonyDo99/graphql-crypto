import { CreateCoinInput } from './create-coin.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCoinInput extends PartialType(CreateCoinInput) {
  @Field(() => Int)
  id: number;
}
