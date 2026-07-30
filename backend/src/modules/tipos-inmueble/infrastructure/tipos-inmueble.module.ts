import { Module } from '@nestjs/common';
import { TiposInmuebleService } from '../application/tipos-inmueble.service';
import { TiposInmuebleController } from './tipos-inmueble.controller';
import { TiposInmuebleRepository } from './tipos-inmueble.repository';

@Module({
  controllers: [TiposInmuebleController],
  providers: [TiposInmuebleService, TiposInmuebleRepository],
})
export class TiposInmuebleModule {}
