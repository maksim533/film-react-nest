import { NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { IFilmsRepository } from 'src/repository/films.repository.interface';
import { FilmsResponseDto, SessionResponseDto } from './dto/films.dto';
import { FilmsService } from './films.service';

describe('FilmsService', () => {
  let service: FilmsService;
  let filmsRepository: IFilmsRepository;

  const mockFilmsRepository: jest.Mocked<IFilmsRepository> = {
    findAll: jest.fn() as any,
    findById: jest.fn() as any,
    findByIds: jest.fn() as any,
    countTotal: jest.fn() as any,
    updateFilmSession: jest.fn() as any,
  } as jest.Mocked<IFilmsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: 'FilmsRepository',
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    filmsRepository = module.get<IFilmsRepository>('FilmsRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return films response with total count', async () => {
      const mockFilms = [
        {
          id: '1',
          rating: '2.9',
          director: 'Итан Райт',
          tags: ['Документальный'],
          image: '/bg1s.jpg',
          cover: '/bg1c.jpg',
          title: 'Архитекторы общества',
          about: 'Документальный фильм',
          description: 'Документальный фильм',
          schedule: [],
        },
      ];

      const mockTotal = 1;

      mockFilmsRepository.findAll.mockResolvedValue(mockFilms);
      mockFilmsRepository.countTotal.mockResolvedValue(mockTotal);

      const result: FilmsResponseDto = await service.findAll();

      expect(result.total).toBe(mockTotal);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('1');
      expect(result.items[0].title).toBe('Архитекторы общества');
      expect(result.items[0].director).toBe('Итан Райт');
      expect(result.items[0].rating).toBe('2.9');
      expect(result.items[0].tags).toEqual(['Документальный']);
      expect(result.items[0].about).toBe('Документальный фильм');
      expect(result.items[0].description).toBe('Документальный фильм');
      expect(result.items[0].image).toBe('/bg1s.jpg');
      expect(result.items[0].cover).toBe('/bg1c.jpg');
      expect(result.items[0].schedule).toEqual([]);
      expect(mockFilmsRepository.findAll).toHaveBeenCalled();
      expect(mockFilmsRepository.countTotal).toHaveBeenCalled();
      expect(filmsRepository.findAll).toHaveBeenCalled();
      expect(filmsRepository.countTotal).toHaveBeenCalled();
    });

    it('should return empty array when no films', async () => {
      mockFilmsRepository.findAll.mockResolvedValue([]);
      mockFilmsRepository.countTotal.mockResolvedValue(0);

      const result = await service.findAll();

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });
  });

  describe('findById', () => {
    it('should return session response for existing film', async () => {
      const filmId = '1';
      const mockFilm = {
        id: filmId,
        rating: '2.9',
        director: 'Итан Райт',
        tags: ['Документальный'],
        image: '/bg1s.jpg',
        cover: '/bg1c.jpg',
        title: 'Архитекторы общества',
        about: 'Документальный фильм',
        description: 'Документальный фильм',
        schedule: [
          {
            id: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: ['1:1', '2:1'],
          },
          {
            id: 'session-2',
            daytime: '2024-06-28T12:00:53+03:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: [],
          },
        ],
      };

      mockFilmsRepository.findById.mockResolvedValue(mockFilm);

      const result: SessionResponseDto = await service.findById(filmId);

      expect(result).toEqual({
        total: 2,
        items: [
          {
            id: 'session-1',
            daytime: '2024-06-28T10:00:53+03:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: ['1:1', '2:1'],
          },
          {
            id: 'session-2',
            daytime: '2024-06-28T12:00:53+03:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: [],
          },
        ],
      });

      expect(filmsRepository.findById).toHaveBeenCalledWith(filmId);
    });

    it('should throw NotFoundException when film not found', async () => {
      const filmId = 'non-existent-id';
      mockFilmsRepository.findById.mockResolvedValue(null);
      await expect(service.findById(filmId)).rejects.toThrow(NotFoundException);
      await expect(service.findById(filmId)).rejects.toThrow(
        `Фильм с ${filmId} не найден`,
      );

      expect(filmsRepository.findById).toHaveBeenCalledWith(filmId);
    });

    it('should return empty sessions array when film has no schedule', async () => {
      const filmId = '1';
      const mockFilm = {
        id: filmId,
        rating: '2.9',
        director: 'Итан Райт',
        tags: ['Документальный'],
        image: '/bg1s.jpg',
        cover: '/bg1c.jpg',
        title: 'Архитекторы общества',
        about: 'Документальный фильм',
        description: 'Документальный фильм',
        schedule: [],
      };

      mockFilmsRepository.findById.mockResolvedValue(mockFilm);

      const result = await service.findById(filmId);

      expect(result).toEqual({
        total: 0,
        items: [],
      });
    });
  });
});
