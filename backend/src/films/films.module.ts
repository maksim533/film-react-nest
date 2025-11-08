import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FilmPostgresEntity,
  SchedulePostgresEntity,
} from './entities/films.postgres.entity';
import {
  FilmMongoEntity,
  ScheduleMongoEntity,
} from './entities/films.mongodb.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      process.env.DATABASE_DRIVER === 'postgres'
        ? [FilmPostgresEntity, SchedulePostgresEntity]
        : [FilmMongoEntity, ScheduleMongoEntity],
    ),
  ],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [],
})
export class FilmsModule {}
