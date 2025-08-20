import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, ForbiddenException } from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { ApiTags, ApiCreatedResponse, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
@ApiTags('produtores')
@Controller('produtor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProdutorController {
  constructor(private readonly produtorService: ProdutorService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo produtor' })
  @ApiResponse({ status: 409, description: 'Cpf ou Cnpj já está em uso.' })
  @ApiCreatedResponse({ description: 'Produtor criado com sucesso.' })
  @ApiBody({ type: CreateProdutorDto })
  create(@Body() createProdutorDto: CreateProdutorDto, @CurrentUser() user: CurrentUserDto) {

    const produtorData = {
      ...createProdutorDto,
      userId: user.role === 'admin' ? (createProdutorDto.userId || user.id) : user.id
    };


    return this.produtorService.create(produtorData);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores' })
  @ApiResponse({ status: 200, description: 'Lista de produtores retornada com sucesso.' })
  findAll(@CurrentUser() user: CurrentUserDto) {
    return this.produtorService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    return this.produtorService.findOne(+id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produtor por ID' })
  @ApiCreatedResponse({ description: 'Produtor atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  @ApiBody({ type: UpdateProdutorDto })
  async update(@Param('id') id: string, @Body() updateProdutorDto: UpdateProdutorDto, @CurrentUser() user: CurrentUserDto) {
    
    return this.produtorService.update(+id, user.id, updateProdutorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover produtor' })
  @ApiResponse({ status: 200, description: 'Produtor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {

    return this.produtorService.removeByUser(+id, user.id);
  }
}