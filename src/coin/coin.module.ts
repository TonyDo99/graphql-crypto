// LIBS
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Service injected import
import { CoinService } from './coin.service';

// Query Input Graph API importing
import { CoinResolver } from './coin.resolver';

// Module import
import { UserModule } from 'src/user/user.module';

// Entity import
import { CoinEntity } from 'src/entities/coin.entity';
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
