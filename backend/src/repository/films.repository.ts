import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/models/films.model';

export interface IFilmsRepository {
  findAll(): Promise<Film[]>;
  findById(id: string): Promise<Film | null>;
  countTotal(): Promise<number>;
}

@Injectable()
export class FilmsRepository implements IFilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }

  async findById(id: string): Promise<Film> {
    return await this.filmModel.findOne({ id: id }).exec();
  }

  async countTotal(): Promise<number> {
    return this.filmModel.countDocuments().exec();
  }

  async findByIds(ids: string[]): Promise<Film[]> {
    return this.filmModel.find({ id: { $in: ids } }).exec();
  }

  async updateFilmSession(
    film: Film,
    sessionId: string,
    seatKey: string,
    daytime: string,
  ): Promise<Film> {
    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) {
      throw new BadRequestException(`Сеанс с ID ${sessionId} не найден`);
    }

    if (session.daytime !== daytime) {
      throw new BadRequestException(`Дата сеанса не совпадает`);
    }

    if (session.taken.includes(seatKey)) {
      throw new BadRequestException(`Место ${seatKey} уже занято`);
    }

    session.taken.push(seatKey);
    return await film.save();
  }
}
