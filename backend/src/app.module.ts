import { FilmsModule } from './films/films.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database/database.module';

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
    ServeStaticModule.forRoot({
      rootPath: rootPath,
      serveRoot: '/content/afisha',
      exclude: ['/api*'],
    }),
    DatabaseModule.forRoot(),
    FilmsModule,
    OrderModule,
  ],
  providers: [configProvider],
})
export class AppModule {}
