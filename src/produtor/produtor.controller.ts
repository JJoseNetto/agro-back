import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { ApiTags, ApiCreatedResponse, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
@ApiTags('produtores')
@Controller('produtor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProdutorController {
  constructor(private readonly produtorService: ProdutorService) {}

  @Post()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Criar novo produtor' })
  @ApiResponse({ status: 409, description: 'Cpf ou Cnpj já está em uso.' })
  @ApiCreatedResponse({ description: 'Produtor criado com sucesso.' })
  @ApiBody({ type: CreateProdutorDto })
  create(@Body() createProdutorDto: CreateProdutorDto, @CurrentUser() user: CurrentUserDto) {

    const produtorData = {
      ...createProdutorDto,
      userId: user.role === 'admin' ? (createProdutorDto.userId || Number(user.id)) : Number(user.id)
    };


    return this.produtorService.create(produtorData);
  }

  @Get()
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Listar todos os produtores' })
  @ApiResponse({ status: 200, description: 'Lista de produtores retornada com sucesso.' })
  findAll(@CurrentUser() user: CurrentUserDto) {
    console.log('User received:', user);
    if(user.role === 'admin') {
      return this.produtorService.findAll();
    }

    return this.produtorService.findByUserId(Number(user.id));
  }

  @Get(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  findOne(@Param('id') id: string) {
    return this.produtorService.findOne(+id);
  }

  @Put(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Atualizar produtor por ID' })
  @ApiCreatedResponse({ description: 'Produtor atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  @ApiBody({ type: UpdateProdutorDto })
  update(@Param('id') id: string, @Body() updateProdutorDto: UpdateProdutorDto) {
    return this.produtorService.update(+id, updateProdutorDto);
  }

  @Delete(':id')
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Remover produtor' })
  @ApiResponse({ status: 200, description: 'Produtor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado.' })
  remove(@Param('id') id: string) {
    return this.produtorService.remove(+id);
  }
}
