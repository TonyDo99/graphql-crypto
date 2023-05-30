import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserBoughtCoin {
  @Field(() => Int, { description: 'Coin quantity user was bought' })
  quantityBought: number;

  @Field(() => String, { description: 'Coin image user was bought' })
  htr_HSR_symbol: string;

  @Field(() => Number, { description: 'Coin amount user was bought' })
  paid: number;
}
