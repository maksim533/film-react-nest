import { IsArray, IsNumber, IsString } from 'class-validator';

//TODO реализовать DTO для /orders

export class OrderDto {
  @IsString()
  film: string;
  @IsString()
  session: string;
  @IsString()
  daytime: string;
  @IsNumber()
  row: number;
  @IsNumber()
  seat: number;
  @IsNumber()
  price: number;
  @IsString()
  id: string;

  constructor(session: OrderDto) {
    this.id = session.id;
    this.film = session.film;
    this.daytime = session.daytime;
    this.price = session.price;
    this.row = session.row;
    this.seat = session.seat;
    this.session = session.session;
  }
}

export class CreateOrderDto {
  @IsString()
  email: string;
  @IsString()
  phone: string;
  @IsArray()
  tickets: OrderDto[];
}

export class OrderResponseDto {
  @IsNumber()
  total: number;
  @IsArray()
  items: OrderDto[];
}
