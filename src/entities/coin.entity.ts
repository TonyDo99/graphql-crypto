// LIBS
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tb_coin' })
@ObjectType()
export class CoinEntity {
  @Field(() => String, { description: 'id coin market' })
  @PrimaryGeneratedColumn('uuid')
  CN_Id: string;

  @Field(() => String, { description: 'name of coin market' })
  @Column({ type: 'varchar', nullable: false, unique: true })
  CN_Name: string;

  @Field(() => String, { description: 'symbol of coin market' })
  @Column({ type: 'varchar', nullable: false })
  CN_Symbol: string;

  @Field(() => String, { description: 'slug of coin market' })
  @Column({ type: 'varchar', nullable: false })
  CN_Slug: string;

  @Field(() => Number, { description: 'price base on usd of coin market' })
  @Column({ type: 'float', nullable: false })
  CN_Price: number;

  @Field(() => Number, { description: 'rank of coin market' })
  @Column({ type: 'int', nullable: true })
  CN_Rank: number;

  @Field(() => Number)
  @Column({ type: 'int', nullable: false })
  CN_Num_Market_Pairs: number;

  @Field(() => Number, {
    description: 'circulating supply: change of coin market',
  })
  @Column({ type: 'bigint', nullable: false })
  CN_Circulating_Supply: number;

  @Field(() => Number, { description: 'total was supply of coin market' })
  @Column({ type: 'bigint', nullable: false })
  CN_Total_Supply: number;

  @Field(() => Number, {
    description: 'max supply of coin market',
    nullable: true,
  })
  @Column({ type: 'bigint', nullable: true })
  CN_Max_Supply: number;

  @Field(() => Date, { description: 'create time of coin market' })
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date, { description: 'last update of coin market' })
  @UpdateDateColumn()
  last_updated: Date;
}
