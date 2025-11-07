import { FilmsModule } from './films/films.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';

const isDev = process.env.NODE_ENV !== 'production';
const rootPath = isDev
  ? path.join(process.cwd(), 'public', 'content', 'afisha')
  : path.join(__dirname, '..', 'public', 'content', 'afisha');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: rootPath,
      serveRoot: '/content/afisha',
      exclude: ['/api*'],
    }),
    FilmsModule,
    OrderModule,
  ],
  providers: [configProvider],
})
export class AppModule {}
