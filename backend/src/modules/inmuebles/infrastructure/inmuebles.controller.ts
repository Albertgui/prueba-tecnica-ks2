import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { InmueblesService } from '../application/inmuebles.service';
import { CreateInmuebleDto } from './dto/create-inmueble.dto';
import { FilterInmuebleDto } from './dto/filter-inmueble.dto';
import { UpdateInmuebleDto } from './dto/update-inmueble.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

type RequestWithUser = ExpressRequest & { user: { id: string; email: string } };

@ApiTags('Inmuebles')
@ApiBearerAuth()
@Controller('inmuebles')
export class InmueblesController {
  constructor(private readonly inmueblesService: InmueblesService) {}

  @ApiOperation({ summary: 'Obtener catálogo de inmuebles (con filtros y paginación)' })
  @ApiResponse({ status: 200, description: 'Catálogo de inmuebles' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query() filters: FilterInmuebleDto,
    @Request() req: RequestWithUser,
  ) {
    return this.inmueblesService.findAll(filters, req.user.id);
  }

  @ApiOperation({ summary: 'Obtener detalle completo de un inmueble' })
  @ApiResponse({ status: 200, description: 'Detalle del inmueble' })
  @ApiResponse({ status: 404, description: 'Inmueble no encontrado' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inmueblesService.findOne(id);
  }

  @ApiOperation({ summary: 'Publicar un nuevo inmueble' })
  @ApiResponse({ status: 201, description: 'Inmueble publicado' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createInmuebleDto: CreateInmuebleDto,
    @Request() req: RequestWithUser,
  ) {
    return this.inmueblesService.create(req.user.id, createInmuebleDto);
  }

  @ApiOperation({ summary: 'Editar un inmueble (Solo propietario)' })
  @ApiResponse({ status: 200, description: 'Inmueble actualizado' })
  @ApiResponse({ status: 404, description: 'Inmueble no encontrado (o no pertenece al usuario)' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInmuebleDto: UpdateInmuebleDto,
    @Request() req: RequestWithUser,
  ) {
    return this.inmueblesService.update(id, req.user.id, updateInmuebleDto);
  }

  @ApiOperation({ summary: 'Cambiar estado del inmueble (Solo propietario)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 409, description: 'Transición de estado inválida' })
  @ApiResponse({ status: 404, description: 'Inmueble no encontrado' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id') id: string,
    @Body() dto: UpdateEstadoDto,
    @Request() req: RequestWithUser,
  ) {
    return this.inmueblesService.cambiarEstado(id, req.user.id, dto.estado);
  }

  @ApiOperation({ summary: 'Eliminar un inmueble lógicamente (Solo propietario)' })
  @ApiResponse({ status: 200, description: 'Inmueble eliminado' })
  @ApiResponse({ status: 404, description: 'Inmueble no encontrado' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.inmueblesService.remove(id, req.user.id);
  }
}
