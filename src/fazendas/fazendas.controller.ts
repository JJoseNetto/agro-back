import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { FazendasService } from './fazendas.service';
import { CreateFazendaDto } from './dto/create-fazenda.dto';
import { UpdateFazendaDto } from './dto/update-fazenda.dto';
import { ApiTags, ApiCreatedResponse, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentUserDto } from '../auth/dto/current-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('fazendas')
@Controller('fazendas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FazendasController {
  constructor(private readonly fazendasService: FazendasService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova fazenda' })
  @ApiCreatedResponse({ description: 'Fazenda criada com sucesso.' })
  @ApiResponse({ status: 409, description: 'Fazenda já existe.' })
  @ApiBody({ type: CreateFazendaDto })
  create(@Body() createFazendaDto: CreateFazendaDto, @CurrentUser() user: CurrentUserDto) {
    return this.fazendasService.create(createFazendaDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as fazendas' })
  @ApiResponse({ status: 200, description: 'Lista de fazendas retornada com sucesso.' })
  findAll(@CurrentUser() user: CurrentUserDto) {
    return this.fazendasService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    return this.fazendasService.findOne(+id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar fazenda' })
  @ApiCreatedResponse({ description: 'Fazenda atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  @ApiBody({ type: UpdateFazendaDto })
  update(@Param('id') id: string, @Body() updateFazendaDto: UpdateFazendaDto, @CurrentUser() user: CurrentUserDto) {
    return this.fazendasService.update(+id, updateFazendaDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover fazenda' })
  @ApiResponse({ status: 200, description: 'Fazenda removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada.' })
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    return this.fazendasService.remove(+id, user);
  }
}
