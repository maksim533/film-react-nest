import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create and return an order with tickets', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            id: 'ticket-1',
            film: 'Film 1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 5,
            price: 350,
          },
          {
            id: 'ticket-2',
            film: 'Film 1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 6,
            price: 350,
          },
        ],
      };

      const orderResponse: OrderResponseDto = {
        total: 700,
        items: [
          {
            id: 'ticket-1',
            film: 'Film 1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 5,
            price: 350,
          },
          {
            id: 'ticket-2',
            film: 'Film 1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 6,
            price: 350,
          },
        ],
      };
      mockOrderService.createOrder.mockResolvedValue(orderResponse);
      const result = await orderController.createOrder(createOrderDto);
      expect(result).toEqual(orderResponse);
      expect(orderService.createOrder).toHaveBeenCalledWith(createOrderDto);
    });

    it('should handle single ticket order', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991112233',
        tickets: [
          {
            id: 'ticket-single',
            film: 'Film 2',
            session: 'session-2',
            daytime: '2024-06-28T12:00:53+03:00',
            row: 3,
            seat: 7,
            price: 450,
          },
        ],
      };

      const orderResponse: OrderResponseDto = {
        total: 450,
        items: [
          {
            id: 'ticket-single',
            film: 'Film 2',
            session: 'session-2',
            daytime: '2024-06-28T12:00:53+03:00',
            row: 3,
            seat: 7,
            price: 450,
          },
        ],
      };

      mockOrderService.createOrder.mockResolvedValue(orderResponse);

      const result = await orderController.createOrder(createOrderDto);

      expect(result.total).toBe(450);
      expect(result.items).toHaveLength(1);
      expect(orderService.createOrder).toHaveBeenCalledWith(createOrderDto);
    });

    it('should handle service errors', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            id: 'ticket-1',
            film: 'Film 1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 5,
            price: 350,
          },
        ],
      };

      const error = new Error('Seat already taken');
      mockOrderService.createOrder.mockRejectedValue(error);

      await expect(orderController.createOrder(createOrderDto)).rejects.toThrow(
        'Seat already taken',
      );
    });

    it('should calculate correct total for multiple tickets', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79994445566',
        tickets: [
          {
            id: 't1',
            film: 'F1',
            session: 's1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 1,
            price: 300,
          },
          {
            id: 't2',
            film: 'F1',
            session: 's1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 2,
            price: 300,
          },
          {
            id: 't3',
            film: 'F1',
            session: 's1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 3,
            price: 300,
          },
        ],
      };

      const orderResponse: OrderResponseDto = {
        total: 3,
        items: createOrderDto.tickets,
      };

      mockOrderService.createOrder.mockResolvedValue(orderResponse);

      const result = await orderController.createOrder(createOrderDto);

      expect(result.total).toBe(3);
      expect(result.items).toHaveLength(3);
    });
  });
});
