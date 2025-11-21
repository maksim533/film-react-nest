import { Test } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsResponseDto, SessionResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let filmsController: FilmsController;
  let filmsService: FilmsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    filmsController = moduleRef.get<FilmsController>(FilmsController);
    filmsService = moduleRef.get<FilmsService>(FilmsService);
  });

  describe('findAll', () => {
    it('should return an array of films', async () => {
      const result: FilmsResponseDto = {
        items: [
          {
            id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
            rating: '2.9',
            director: 'Итан Райт',
            tags: ['Документальный'],
            image: '/bg1s.jpg',
            cover: '/bg1c.jpg',
            title: 'Архитекторы общества',
            about:
              'Документальный фильм, исследующий влияние искусственного интеллекта на современное общество',
            description:
              'Документальный фильм Итана Райта исследует влияние технологий на современное общество',
            schedule: [
              {
                id: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
                daytime: '2024-06-28T10:00:53+03:00',
                hall: 0,
                rows: 5,
                seats: 10,
                price: 350,
                taken: ['1:1', '2:1', '3:1', '3:2', '4:1', '5:1'],
              },
            ],
          },
        ],
        total: 10,
      };
      jest.spyOn(filmsService, 'findAll').mockResolvedValue(result);

      expect(await filmsController.findByAll()).toBe(result);
      expect(filmsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return film by id', async () => {
      const filmId = '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf';

      const result: SessionResponseDto = {
        items: [
          {
            id: filmId,
            daytime: '2024-06-28T10:00:53+03:00',
            hall: 0,
            rows: 5,
            seats: 10,
            price: 350,
            taken: ['1:1', '2:1', '3:1', '3:2', '4:1', '5:1'],
          },
        ],
        total: 1,
      };

      jest.spyOn(filmsService, 'findById').mockResolvedValue(result);

      expect(await filmsController.findById(filmId)).toBe(result);

      expect(filmsService.findById).toHaveBeenCalledWith(filmId);
    });

    it('should return null when film not found', async () => {
      const filmId = 'non-existent-id';
      jest.spyOn(filmsService, 'findById').mockResolvedValue(null);

      const result = await filmsController.findById(filmId);

      expect(result).toBeNull();
      expect(filmsService.findById).toHaveBeenCalledWith(filmId);
    });
  });
});
