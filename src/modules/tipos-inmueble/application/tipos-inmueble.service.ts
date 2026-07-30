import { Injectable } from '@nestjs/common';
import { TiposInmuebleRepository } from '../infrastructure/tipos-inmueble.repository';
import { CreateTipoInmuebleDto } from '../infrastructure/dto/create-tipo-inmueble.dto';

@Injectable()
export class TiposInmuebleService {
  constructor(private readonly repository: TiposInmuebleRepository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async create(dto: CreateTipoInmuebleDto) {
    return this.repository.create(dto);
  }
}
