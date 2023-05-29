// LIBS
import { ObjectType, Field, Int } from '@nestjs/graphql';

// IMPORT ENTITIES MODELS
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletEntity } from './wallet.entity';
import { HistoryEntity } from './history.entity';

@Entity({
  name: 'tb_user',
})
@ObjectType()
export class UserEntity {
  @Field(() => String, { description: 'id of user' })
  @PrimaryGeneratedColumn('uuid')
  US_Id: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    nullable: false,
  })
  US_Name: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  US_Email: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    nullable: false,
  })
  US_Password: string;

  @Field(() => Int)
  @Column({
    type: 'int',
    nullable: false,
  })
  US_Age: number;

  @Field(() => Date)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  last_updated: Date;

  @Field(() => [WalletEntity])
  @OneToMany(() => WalletEntity, (ref) => ref.user)
  wallets: WalletEntity[];

  @Field(() => [HistoryEntity])
  @OneToMany(() => HistoryEntity, (ref) => ref.user)
  histories: HistoryEntity[];
}
