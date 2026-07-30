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
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';

type RequestWithUser = ExpressRequest & { user: { id: string; email: string } };

@Controller('inmuebles')
export class InmueblesController {
  constructor(private readonly inmueblesService: InmueblesService) {}

  @Get()
  findAll(@Query() filters: FilterInmuebleDto) {
    return this.inmueblesService.findAll(filters);
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
  @Patch(':id/reservar')
  reservar(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.inmueblesService.reservar(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/vender')
  vender(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.inmueblesService.vender(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/liberar')
  liberar(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.inmueblesService.liberar(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.inmueblesService.remove(id, req.user.id);
  }
}
