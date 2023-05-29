import { Module } from '@nestjs/common';
import { CoinService } from './coin.service';
import { CoinResolver } from './coin.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinEntity } from 'src/entities/coin.entity';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/entities/user.entity';
import { HistoryEntity } from 'src/entities/history.entity';
import { WalletEntity } from 'src/entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CoinEntity,
      UserEntity,
      HistoryEntity,
      WalletEntity,
    ]),
    UserModule,
  ],
  providers: [CoinResolver, CoinService],
})
export class CoinModule {}
