import { Injectable, NotFoundException } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import {
  FilmsDto,
  FilmsResponseDto,
  SessionDto,
  SessionResponseDto,
} from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async findAll(): Promise<FilmsResponseDto> {
    const [films, total] = await Promise.all([
      this.filmsRepository.findAll(),
      this.filmsRepository.countTotal(),
    ]);

    const filmsDto = films.map((film) => new FilmsDto(film));

    return {
      total: total,
      items: filmsDto,
    };
  }

  async findById(id: string): Promise<SessionResponseDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException(`Фильм с ${id} не найден`);
    }

    const sessionDto = film.schedule.map((session) => new SessionDto(session));
    return {
      total: sessionDto.length,
      items: sessionDto,
    };
  }
}
