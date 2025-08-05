import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CulturasPlantadasService } from './culturas-plantadas.service';
import { CreateCulturaPlantadaDto } from './dto/create-cultura-plantada.dto';
import { UpdateCulturaPlantadaDto } from './dto/update-cultura-plantada.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('culturas-plantadas')
@Controller('culturas-plantadas')
export class CulturasPlantadasController {
    constructor(private readonly culturasPlantadasService: CulturasPlantadasService) { }

    @Post()
    @ApiCreatedResponse({ description: 'Cultura plantada criada com sucesso.' })
    @ApiBody({ type: CreateCulturaPlantadaDto })
    create(@Body() createCulturaPlantadaDto: CreateCulturaPlantadaDto) {
        return this.culturasPlantadasService.create(createCulturaPlantadaDto);
    }

    @Get()
    findAll() {
        return this.culturasPlantadasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.culturasPlantadasService.findOne(+id);
    }

    @Patch(':id')
    @ApiBody({ type: UpdateCulturaPlantadaDto })
    update(@Param('id') id: string, @Body() updateCulturaPlantadaDto: UpdateCulturaPlantadaDto) {
        return this.culturasPlantadasService.update(+id, updateCulturaPlantadaDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.culturasPlantadasService.remove(+id);
    }
}
