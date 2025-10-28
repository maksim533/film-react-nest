import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, OrderDto, OrderResponseDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(createOrder: CreateOrderDto): Promise<OrderResponseDto> {
    const { tickets } = createOrder;

    if (!Array.isArray(tickets) || tickets.length === 0)
      throw new BadRequestException(
        'Заказ должен содержать хотя бы один билет',
      );

    try {
      const sessionResults = [];

      for (const ticket of tickets) {
        const seatKey = `${ticket.row}:${ticket.seat}`;

        await this.filmsRepository.createOrderSession(
          ticket.film,
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
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
