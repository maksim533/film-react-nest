import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FilmPostgresEntity,
  SchedulePostgresEntity,
} from '../films/entities/films.postgres.entity';
import {
  FilmMongoEntity,
  ScheduleMongoEntity,
} from '../films/entities/films.mongodb.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      process.env.DATABASE_DRIVER === 'postgres'
        ? [FilmPostgresEntity, SchedulePostgresEntity]
        : [FilmMongoEntity, ScheduleMongoEntity],
    ),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
