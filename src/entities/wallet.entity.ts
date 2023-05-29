// LIBS
import { Field, ObjectType } from '@nestjs/graphql';

// IMPORT ENTITIES MODELS
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'tb_wallet' })
@Unique(['WL_Symbol', 'user'])
@ObjectType()
export class WalletEntity {
  @Field(() => Number, { description: 'wallet id' })
  @PrimaryGeneratedColumn('increment')
  WL_Id: number;

  @Field(() => String, { description: 'wallet name' })
  @Column({ type: 'varchar' })
  WL_Name: string;

  @Field(() => String, { description: 'wallet symbol' })
  @Column({ type: 'varchar' })
  WL_Symbol: string;

  @Field(() => Number, { description: 'wallet base value' })
  @Column({ type: 'float' })
  WL_Amount: number;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  last_updated: Date;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (ref) => ref.wallets, {
    nullable: false,
  })
  user: UserEntity;
}
