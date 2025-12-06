import { IsArray, IsNumber, IsString } from 'class-validator';
import { FilmData, SessionData } from './films-data.interface';

export class FilmsDto {
  @IsString()
  id: string;
  @IsString()
  rating: string;
  @IsString()
  director: string;
  @IsArray()
  tags: string[];
  @IsString()
  title: string;
  @IsString()
  about: string;
  @IsString()
  description: string;
  @IsString()
  image: string;
  @IsString()
  cover: string;
  @IsArray()
  schedule: SessionData[];

  constructor(film: FilmData) {
    this.id = film.id;
    this.rating = film.rating;
    this.director = film.director;
    this.tags = film.tags;
    this.title = film.title;
    this.about = film.about;
    this.description = film.description;
    this.image = film.image;
    this.cover = film.cover;
    this.schedule = film.schedule || [];
  }
}

export class SessionDto {
  @IsString()
  id: string;
  @IsString()
  daytime: string;
  @IsNumber()
  hall: number;
  @IsNumber()
  rows: number;
  @IsNumber()
  seats: number;
  @IsNumber()
  price: number;
  @IsArray()
  taken: string | string[];

  constructor(session: SessionData) {
    this.id = session.id;
    this.daytime = session.daytime;
    this.hall = session.hall;
    this.rows = session.rows;
    this.seats = session.seats;
    this.price = session.price;
    this.taken = session.taken;
  }
}

export class FilmsResponseDto {
  @IsNumber()
  total: number;
  @IsArray()
  items: FilmsDto[];
}

export class SessionResponseDto {
  @IsNumber()
  total: number;
  @IsArray()
  items: SessionDto[];
}
