import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, OrderDto, OrderResponseDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(createOrder: CreateOrderDto): Promise<OrderResponseDto> {
    const { tickets } = createOrder;

    if (!Array.isArray(tickets) || tickets.length === 0) {
      throw new BadRequestException(
        'Заказ должен содержать хотя бы один билет',
      );
    }

    const uniqueFilmIds = [...new Set(tickets.map((ticket) => ticket.film))];

    const films = await this.filmsRepository.findByIds(uniqueFilmIds);

    const filmsMap = new Map();
    films.forEach((film) => filmsMap.set(film.id, film));

    const sessionResults = [];

    for (const ticket of tickets) {
      const seatKey = `${ticket.row}:${ticket.seat}`;

      const film = filmsMap.get(ticket.film);
      if (!film) {
        throw new NotFoundException(`Фильм с ID ${ticket.film} не найден`);
      }

      await this.filmsRepository.updateFilmSession(
        film,
        ticket.session,
        seatKey,
        ticket.daytime,
      );

      sessionResults.push(
        new OrderDto({
          id: ticket.session,
          film: ticket.film,
          session: ticket.session,
          daytime: ticket.daytime,
          row: ticket.row,
          seat: ticket.seat,
          price: ticket.price,
        }),
      );
    }

    return {
      total: sessionResults.length,
      items: sessionResults,
    };
  }
}
