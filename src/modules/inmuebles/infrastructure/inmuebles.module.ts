import { Module } from '@nestjs/common';
import { InmueblesService } from '../application/inmuebles.service';
import { InmueblesController } from './inmuebles.controller';
import { InmueblesRepository } from './inmuebles.repository';

@Module({
  controllers: [InmueblesController],
  providers: [InmueblesService, InmueblesRepository],
})
export class InmueblesModule {}
