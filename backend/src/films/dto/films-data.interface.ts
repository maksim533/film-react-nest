export interface FilmData {
  id: string;
  rating: string;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
  schedule: SessionData[];
}

export interface SessionData {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string | string[];
}
