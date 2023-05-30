import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
import { HistoryModule } from './history/history.module';
import { CoinModule } from './coin/coin.module';
import { AppController } from './app.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      envFilePath: `${
        process.env.NODE_ENV === 'dev' ? '.env.local' : '.env.production'
      }`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_HOST,
      entities: [join(__dirname, 'entities/*.entity{.ts,.js}')],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
    }),
    UserModule,
    WalletModule,
    WalletModule,
    HistoryModule,
    CoinModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
