import { FilmsService } from './films.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findByAll() {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findById(@Param('id') id: string) {
    return this.filmsService.findById(id);
  }
}
