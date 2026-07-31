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

type RequestWithUser = ExpressRequest & { user: { id: string; email: string } };

@Controller('inmuebles')
export class InmueblesController {
  constructor(private readonly inmueblesService: InmueblesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() filters: FilterInmuebleDto, @Request() req: RequestWithUser) {
    return this.inmueblesService.findAll(filters, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inmueblesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createInmuebleDto: CreateInmuebleDto,
    @Request() req: RequestWithUser,
  ) {
    return this.inmueblesService.create(req.user.id, createInmuebleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInmuebleDto: UpdateInmuebleDto,
    @Request() req: RequestWithUser,
  ) {
    return this.inmueblesService.update(id, req.user.id, updateInmuebleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/estado')
  cambiarEstado(
    @Param('id') id: string,
    @Body() dto: UpdateEstadoDto,
    @Request() req: RequestWithUser,
  ) {
    return this.inmueblesService.cambiarEstado(id, req.user.id, dto.estado);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.inmueblesService.remove(id, req.user.id);
  }
}
