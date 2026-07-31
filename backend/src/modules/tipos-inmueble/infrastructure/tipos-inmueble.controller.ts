import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TiposInmuebleService } from '../application/tipos-inmueble.service';
import { CreateTipoInmuebleDto } from './dto/create-tipo-inmueble.dto';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tipos de Inmueble')
@Controller('tipos-inmueble')
export class TiposInmuebleController {
  constructor(private readonly service: TiposInmuebleService) {}

  @ApiOperation({ summary: 'Obtener tipos de inmueble' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de inmueble activos' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Crear un nuevo tipo de inmueble' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Tipo de inmueble creado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTipoInmuebleDto) {
    return this.service.create(dto);
  }
}
