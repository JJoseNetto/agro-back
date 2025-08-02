import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { FazendasService } from './fazendas.service';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';

@Controller('fazendas')
export class FazendasController {
  constructor(private readonly fazendasService: FazendasService) {}

  @Post()
  create(@Body() createFazendaDto: CreateFazendaDto) {
    return this.fazendasService.create(createFazendaDto);
  }

  @Get()
  findAll() {
    return this.fazendasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fazendasService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFazendaDto: UpdateFazendaDto) {
    return this.fazendasService.update(+id, updateFazendaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fazendasService.remove(+id);
  }
}
