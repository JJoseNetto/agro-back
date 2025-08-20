import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CulturasPlantadasService } from './culturas-plantadas.service';
import { CreateCulturaPlantadaDto } from './dto/create-cultura-plantada.dto';
import { UpdateCulturaPlantadaDto } from './dto/update-cultura-plantada.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

@ApiTags('culturas-plantadas')
@Controller('culturas-plantadas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CulturasPlantadasController {
    constructor(private readonly culturasPlantadasService: CulturasPlantadasService) { }

    @Post()
    @ApiCreatedResponse({ description: 'Cultura plantada criada com sucesso.' })
    @ApiBody({ type: CreateCulturaPlantadaDto })
    create(@Body() createCulturaPlantadaDto: CreateCulturaPlantadaDto, @CurrentUser() user: CurrentUserDto ) {
        return this.culturasPlantadasService.create(createCulturaPlantadaDto, user);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todas as culturas plantadas' })
    @ApiResponse({ status: 200, description: 'Lista de culturas plantadas retornada com sucesso.' })
    findAll(@CurrentUser() user: CurrentUserDto) {
        return this.culturasPlantadasService.findAll(user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar cultura plantada por ID' })
    @ApiResponse({ status: 200, description: 'Cultura plantada encontrada.' })
    @ApiResponse({ status: 404, description: 'Cultura plantada não encontrada.' })
    findOne(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
        return this.culturasPlantadasService.findOne(+id, user.id);
    }

    @Patch(':id')
    @ApiBody({ type: UpdateCulturaPlantadaDto })
    update(@Param('id') id: string, @Body() updateCulturaPlantadaDto: UpdateCulturaPlantadaDto, @CurrentUser() user: CurrentUserDto) {
        return this.culturasPlantadasService.update(+id, updateCulturaPlantadaDto, user);
    }

    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.culturasPlantadasService.remove(+id);
    // }
}
