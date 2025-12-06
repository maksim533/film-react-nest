// order.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { IFilmsRepository } from '../repository/films.repository.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, OrderResponseDto, OrderDto } from './dto/order.dto';

describe('OrderService', () => {
  let orderService: OrderService;
  let filmsRepository: IFilmsRepository;

  const mockFilmsRepository: any = {
    findByIds: jest.fn(),
    updateFilmSession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: 'FilmsRepository',
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    filmsRepository = module.get<IFilmsRepository>('FilmsRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create order successfully with multiple tickets', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            id: 'session-1',
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 5,
            price: 350,
          },
          {
            id: 'session-1',
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 6,
            price: 350,
          },
        ],
      };

      const mockFilms = [
        {
          id: 'film-1',
          title: 'Film 1',
          schedule: [
            {
              id: 'session-1',
              daytime: '2024-06-28T10:00:53+03:00',
              taken: [],
            },
          ],
        },
      ];

      mockFilmsRepository.findByIds.mockResolvedValue(mockFilms);
      mockFilmsRepository.updateFilmSession.mockResolvedValue(undefined);

      const result: OrderResponseDto =
        await orderService.createOrder(createOrderDto);

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(result.items[0]).toBeInstanceOf(OrderDto);
      expect(result.items[0].film).toBe('film-1');
      expect(result.items[0].row).toBe(1);
      expect(result.items[0].seat).toBe(5);
      expect(result.items[1].row).toBe(1);
      expect(result.items[1].seat).toBe(6);

      expect(filmsRepository.findByIds).toHaveBeenCalledWith(['film-1']);
      expect(filmsRepository.updateFilmSession).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException when tickets array is empty', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [],
      };

      await expect(orderService.createOrder(createOrderDto)).rejects.toThrow(
        BadRequestException,
      );

      await expect(orderService.createOrder(createOrderDto)).rejects.toThrow(
        'Заказ должен содержать хотя бы один билет',
      );
    });

    it('should throw BadRequestException when tickets is not array', async () => {
      const createOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: 'invalid' as any,
      };

      await expect(orderService.createOrder(createOrderDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when film not found', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            id: 'session-1',
            film: 'non-existent-film',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 5,
            price: 350,
          },
        ],
      };

      mockFilmsRepository.findByIds.mockResolvedValue([]);

      await expect(orderService.createOrder(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );

      await expect(orderService.createOrder(createOrderDto)).rejects.toThrow(
        'Фильм с ID non-existent-film не найден',
      );
    });

    it('should handle multiple films in one order', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            id: 'session-1',
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 5,
            price: 350,
          },
          {
            id: 'session-2',
            film: 'film-2',
            session: 'session-2',
            daytime: '2024-06-28T12:00:53+03:00',
            row: 2,
            seat: 3,
            price: 400,
          },
        ],
      };

      const mockFilms = [
        {
          id: 'film-1',
          title: 'Film 1',
          schedule: [
            {
              id: 'session-1',
              daytime: '2024-06-28T10:00:53+03:00',
              taken: [],
            },
          ],
        },
        {
          id: 'film-2',
          title: 'Film 2',
          schedule: [
            {
              id: 'session-2',
              daytime: '2024-06-28T12:00:53+03:00',
              taken: [],
            },
          ],
        },
      ];

      mockFilmsRepository.findByIds.mockResolvedValue(mockFilms);
      mockFilmsRepository.updateFilmSession.mockResolvedValue(undefined);

      const result = await orderService.createOrder(createOrderDto);

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(filmsRepository.findByIds).toHaveBeenCalledWith([
        'film-1',
        'film-2',
      ]);

      expect(filmsRepository.updateFilmSession).toHaveBeenCalledTimes(2);
    });

    it('should deduplicate film IDs', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            id: 'session-1',
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 5,
            price: 350,
          },
          {
            id: 'session-1',
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 6,
            price: 350,
          },
          {
            id: 'session-2',
            film: 'film-2',
            session: 'session-2',
            daytime: '2024-06-28T12:00:53+03:00',
            row: 2,
            seat: 3,
            price: 400,
          },
        ],
      };

      const mockFilms = [
        {
          id: 'film-1',
          title: 'Film 1',
          schedule: [],
        },
        {
          id: 'film-2',
          title: 'Film 2',
          schedule: [],
        },
      ];

      mockFilmsRepository.findByIds.mockResolvedValue(mockFilms);
      mockFilmsRepository.updateFilmSession.mockResolvedValue(undefined);

      await orderService.createOrder(createOrderDto);

      expect(filmsRepository.findByIds).toHaveBeenCalledWith([
        'film-1',
        'film-2',
      ]);
    });

    it('should call updateFilmSession with correct parameters', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            id: 'session-1',
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 2,
            seat: 7,
            price: 350,
          },
        ],
      };

      const mockFilm = {
        id: 'film-1',
        title: 'Film 1',
        schedule: [
          {
            id: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            taken: [],
          },
        ],
      };

      mockFilmsRepository.findByIds.mockResolvedValue([mockFilm]);
      mockFilmsRepository.updateFilmSession.mockResolvedValue(undefined);

      await orderService.createOrder(createOrderDto);
      expect(filmsRepository.updateFilmSession).toHaveBeenCalledWith(
        mockFilm,
        'session-1',
        '2:7',
        '2024-06-28T10:00:53+03:00',
      );
    });

    it('should handle repository errors', async () => {
      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+79991234567',
        tickets: [
          {
            id: 'session-1',
            film: 'film-1',
            session: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            row: 1,
            seat: 5,
            price: 350,
          },
        ],
      };

      const error = new Error('Database connection failed');
      mockFilmsRepository.findByIds.mockRejectedValue(error);

      await expect(orderService.createOrder(createOrderDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
