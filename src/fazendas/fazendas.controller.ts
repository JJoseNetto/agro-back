import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { FazendasService } from './fazendas.service';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { ApiTags, ApiCreatedResponse, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('fazendas')
@Controller('fazendas')
export class FazendasController {
  constructor(private readonly fazendasService: FazendasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova fazenda' })
  @ApiCreatedResponse({ description: 'Fazenda criada com sucesso.' })
  @ApiResponse({ status: 409, description: 'Fazenda já existe.' })
  @ApiBody({ type: CreateFazendaDto })
  create(@Body() createFazendaDto: CreateFazendaDto) {
    return this.fazendasService.create(createFazendaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as fazendas' })
  @ApiResponse({ status: 200, description: 'Lista de fazendas retornada com sucesso.' })
  findAll() {
    return this.fazendasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  findOne(@Param('id') id: string) {
    return this.fazendasService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar fazenda' })
  @ApiCreatedResponse({ description: 'Fazenda atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  @ApiBody({ type: UpdateFazendaDto })
  update(@Param('id') id: string, @Body() updateFazendaDto: UpdateFazendaDto) {
    return this.fazendasService.update(+id, updateFazendaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover fazenda' })
  @ApiResponse({ status: 200, description: 'Fazenda removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  remove(@Param('id') id: string) {
    return this.fazendasService.remove(+id);
  }
}
