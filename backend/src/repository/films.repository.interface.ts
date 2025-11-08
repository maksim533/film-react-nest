import { FilmData, SessionData } from '../films/dto/films-data.interface';

export interface Film extends FilmData {}
export interface Session extends SessionData {}

export interface IFilmsRepository {
  findAll(): Promise<Film[]>;

  findById(id: string): Promise<Film>;

  countTotal(): Promise<number>;

  findByIds(ids: string[]): Promise<Film[]>;

  updateFilmSession(
    film: Film,
    sessionId: string,
    seatKey: string,
    daytime: string,
  ): Promise<Film>;
}
