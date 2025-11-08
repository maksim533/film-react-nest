import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Film } from './films.repository.interface';
import { IFilmsRepository } from './films.repository.interface';
import { FilmPostgresEntity } from '../films/entities/films.postgres.entity';

@Injectable()
export class FilmsRepositoryPostgreSQL implements IFilmsRepository {
  constructor(
    @InjectRepository(FilmPostgresEntity)
    private filmRepository: Repository<Film>,
  ) {}
  async findAll(): Promise<Film[]> {
    const films = await this.filmRepository.find();
    return films;
  }
  async findById(id: string): Promise<Film> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    return film;
  }
  countTotal(): Promise<number> {
    return this.filmRepository.count();
  }
  async findByIds(ids: string[]): Promise<Film[]> {
    return await this.filmRepository.find({
      where: {
        id: In(ids),
      },
      relations: ['schedule'],
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
      relations: ['schedule'],
    });

    if (!filmEntity) {
      throw new NotFoundException('Фильм не найден');
    }

    const filmSessions = filmEntity.schedule || [];
    const sessionToUpdate = filmSessions.find((s) => s.id === sessionId);

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
