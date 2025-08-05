import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProdutorService } from './produtor.service';
import { CreateProdutorDto } from './dto/create-produtor.dto';
import { UpdateProdutorDto } from './dto/update-produtor.dto';
import { ApiTags, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
@ApiTags('produtores')
@Controller('produtor')
export class ProdutorController {
  constructor(private readonly produtorService: ProdutorService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Produtor criado com sucesso.' })
  @ApiBody({ type: CreateProdutorDto })
  create(@Body() createProdutorDto: CreateProdutorDto) {
    return this.produtorService.create(createProdutorDto);
  }

  @Get()
  findAll() {
    return this.produtorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.produtorService.findOne(+id);
  }

  @Put(':id')
  @ApiCreatedResponse({ description: 'Produtor atualizado com sucesso.' })
  @ApiBody({ type: UpdateProdutorDto })
  update(@Param('id') id: string, @Body() updateProdutorDto: UpdateProdutorDto) {
    return this.produtorService.update(+id, updateProdutorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.produtorService.remove(+id);
  }
}
