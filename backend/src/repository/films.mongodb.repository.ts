import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './films.repository.interface';
import { IFilmsRepository } from './films.repository.interface';
import { FilmMongoEntity } from '../films/entities/films.mongodb.entity';

@Injectable()
export class FilmsRepositoryMongoDB implements IFilmsRepository {
  constructor(
    @InjectRepository(FilmMongoEntity)
    private filmRepository: Repository<Film>,
  ) {}
  async findAll(): Promise<Film[]> {
    const films = await this.filmRepository.find();
    return films;
  }
  async findById(id: string): Promise<Film> {
    const film = await this.filmRepository.findOne({
      where: { id },
    });
    return film;
  }
  countTotal(): Promise<number> {
    return this.filmRepository.count();
  }
  async findByIds(ids: string[]): Promise<Film[]> {
    return await this.filmRepository.find({
      where: {
        id: { $in: ids },
      } as any,
    });
  }

  async updateFilmSession(
    film: Film,
    sessionId: string,
    seatKey: string,
    daytime: string,
  ): Promise<Film> {
    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      throw new NotFoundException(`Сеанс с ID ${sessionId} не найден`);
    }

    const currentTaken = Array.isArray(session.taken)
      ? session.taken
      : session.taken
        ? session.taken.split(',')
        : [];

    if (currentTaken.includes(seatKey)) {
      throw new ConflictException(`Место ${seatKey} уже занято`);
    }

    if (session.daytime !== daytime) {
      throw new BadRequestException(`Дата сеанса не совпадает`);
    }

    const filmEntity = await this.filmRepository.findOne({
      where: { id: film.id },
    });

    if (!filmEntity) {
      throw new NotFoundException('Фильм не найден');
    }

    const sessionToUpdate = filmEntity.schedule.find((s) => s.id === sessionId);
    if (!sessionToUpdate) {
      throw new NotFoundException('Сеанс не найден');
    }

    if (Array.isArray(sessionToUpdate.taken)) {
      sessionToUpdate.taken.push(seatKey);
    } else {
      const takenArray = sessionToUpdate.taken
        ? sessionToUpdate.taken.split(',')
        : [];
      sessionToUpdate.taken = [...takenArray, seatKey].join(',');
    }

    const updatedFilm = await this.filmRepository.save(filmEntity);
    return updatedFilm;
  }
}
