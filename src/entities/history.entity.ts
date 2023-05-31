// LIBS
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// IMPORT ENTITIES MODELS
import { UserEntity } from './user.entity';

@Entity({ name: 'tb_history' })
@ObjectType()
export class HistoryEntity {
  @Field(() => String, { description: 'history id bought' })
  @PrimaryGeneratedColumn('uuid')
  HSR_id: string;

  @Field(() => String, { description: 'symbol currency' })
  @Column({ type: 'varchar' })
  HSR_symbol: string;

  @Field(() => String, { description: 'currency currency' })
  @Column({ type: 'varchar' })
  HSR_currency: string;

  @Field(() => String, { description: 'symbol currency' })
  @Column({ type: 'float' })
  HSR_paid: number;

  @Field(() => Number, { description: 'quantity coin bought' })
  @Column({ type: 'int' })
  HSR_quantity: number;

  @Field(() => GraphQLISODateTime, { description: 'create date history' })
  @CreateDateColumn()
  created_at: Date;

  @Field(() => GraphQLISODateTime, {
    description: 'last update history bought',
  })
  @UpdateDateColumn()
  last_updated: Date;

  @ManyToOne(() => UserEntity, (ref) => ref.histories)
  user: UserEntity;
}
