import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SafrasService } from './safras.service';
import { CreateSafraDto } from './dto/create-safra.dto';
import { UpdateSafraDto } from './dto/update-safra.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('safras')
@Controller('safras')
export class SafrasController {
  constructor(private readonly safrasService: SafrasService) { }

  @Post()
  @ApiOperation({ summary: 'Criar nova safra' })
  @ApiCreatedResponse({ description: 'Safra criada com sucesso.' })
  @ApiBody({ type: CreateSafraDto })
  create(@Body() createSafraDto: CreateSafraDto) {
    return this.safrasService.create(createSafraDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as safras' })
  @ApiResponse({ status: 200, description: 'Lista de safras retornada com sucesso.' })
  findAll() {
    return this.safrasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra encontrada com sucesso.' })
  findOne(@Param('id') id: string) {
    return this.safrasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra atualizada com sucesso.' })
  @ApiBody({ type: UpdateSafraDto })
  update(@Param('id') id: string, @Body() updateSafraDto: UpdateSafraDto) {
    return this.safrasService.update(+id, updateSafraDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra removida com sucesso.' })
  remove(@Param('id') id: string) {
    return this.safrasService.remove(+id);
  }
}
