import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SafrasService } from './safras.service';
import { CreateSafraDto } from './dto/create-safra.dto';
import { UpdateSafraDto } from './dto/update-safra.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('safras')
@Controller('safras')
export class SafrasController {
  constructor(private readonly safrasService: SafrasService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Safra criada com sucesso.' })
  @ApiBody({ type: CreateSafraDto })
  create(@Body() createSafraDto: CreateSafraDto) {
    return this.safrasService.create(createSafraDto);
  }

  @Get()
  findAll() {
    return this.safrasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.safrasService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateSafraDto })
  update(@Param('id') id: string, @Body() updateSafraDto: UpdateSafraDto) {
    return this.safrasService.update(+id, updateSafraDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.safrasService.remove(+id);
  }
}
