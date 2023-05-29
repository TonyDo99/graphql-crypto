import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletResolver } from './wallet.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from 'src/entities/wallet.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity]), UserModule],
  providers: [WalletResolver, WalletService],
})
export class WalletModule {}
