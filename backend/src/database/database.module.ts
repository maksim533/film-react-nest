import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FilmMongoEntity,
  ScheduleMongoEntity,
} from '../films/entities/films.mongodb.entity';
import { FilmsRepositoryMongoDB } from '../repository/films.mongodb.repository';
import {
  FilmPostgresEntity,
  SchedulePostgresEntity,
} from '../films/entities/films.postgres.entity';
import { FilmsRepositoryPostgreSQL } from '../repository/films.postgresql.repository';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const dbType = process.env.DATABASE_DRIVER || 'mongodb';
    const isPostgres = dbType === 'postgres';

    const entities = isPostgres
      ? [FilmPostgresEntity, SchedulePostgresEntity]
      : [FilmMongoEntity, ScheduleMongoEntity];

    const repositoryClass = isPostgres
      ? FilmsRepositoryPostgreSQL
      : FilmsRepositoryMongoDB;
    return {
      module: DatabaseModule,
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            if (isPostgres) {
              return {
                type: 'postgres',
                host: configService.get('DATABASE_HOST', 'localhost'),
                port: configService.get('DATABASE_PORT', 5432),
                username: configService.get('DATABASE_USERNAME', 'postgres'),
                password: configService.get('DATABASE_PASSWORD', 'postgres'),
                database: configService.get('DATABASE_DATABASE', 'afisha'),
                entities: entities,
                synchronize: true,
                logging: true,
              };
            } else {
              return {
                type: 'mongodb',
                url: configService.get(
                  'DATABASE_URL',
                  'mongodb://localhost:27017/afisha',
                ),
                database: 'afisha',
                entities: entities,
                synchronize: true,
                useUnifiedTopology: true,
                logging: true,
              };
            }
          },
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature(entities),
      ],
      providers: [
        repositoryClass,
        {
          provide: 'FilmsRepository',
          useExisting: repositoryClass,
        },
      ],
      exports: ['FilmsRepository', TypeOrmModule],
    };
  }
}
