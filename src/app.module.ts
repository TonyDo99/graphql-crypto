// Libs
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

// Import modules
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { HistoryModule } from './history/history.module';
import { CoinModule } from './coin/coin.module';

// Import controllers
import { AppController } from './app.controller';

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
      installSubscriptionHandlers: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          path: '/graphql',
          onConnect: () => {
            console.log('Socket graphql connection established !');
          },
          onDisconnect: () => {
            console.log('Socket graphql connection disconnected !');
          },
        },
      },
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
