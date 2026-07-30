import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TiposInmuebleService } from '../application/tipos-inmueble.service';
import { CreateTipoInmuebleDto } from './dto/create-tipo-inmueble.dto';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';

@Controller('tipos-inmueble')
export class TiposInmuebleController {
  constructor(private readonly service: TiposInmuebleService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTipoInmuebleDto) {
    return this.service.create(dto);
  }
}
