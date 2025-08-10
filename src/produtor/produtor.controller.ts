import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { ApiTags, ApiCreatedResponse, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiTags('produtores')
@Controller('produtor')
export class ProdutorController {
  constructor(private readonly produtorService: ProdutorService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo produtor' })
  @ApiResponse({ status: 409, description: 'Cpf ou Cnpj já está em uso.' })
  @ApiCreatedResponse({ description: 'Produtor criado com sucesso.' })
  @ApiBody({ type: CreateProdutorDto })
  create(@Body() createProdutorDto: CreateProdutorDto) {
    return this.produtorService.create(createProdutorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores' })
  @ApiResponse({ status: 200, description: 'Lista de produtores retornada com sucesso.' })
  findAll() {
    return this.produtorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.produtorService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produtor por ID' })
  @ApiCreatedResponse({ description: 'Produtor atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  @ApiBody({ type: UpdateProdutorDto })
  update(@Param('id') id: string, @Body() updateProdutorDto: UpdateProdutorDto) {
    return this.produtorService.update(+id, updateProdutorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover produtor' })
  @ApiResponse({ status: 200, description: 'Produtor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  remove(@Param('id') id: string) {
    return this.produtorService.remove(+id);
  }
}
