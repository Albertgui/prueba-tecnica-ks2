import { BadRequestException } from '@nestjs/common';
import { EstadoInmueble } from '@prisma/client';

export class InmuebleEntity {
  constructor(
    public readonly id: string,
    public readonly direccion: string,
    public readonly precio: number,
    public readonly habitaciones: number,
    public readonly metrosCuadrados: number,
    private _estado: EstadoInmueble,
    public readonly vendedorId: string,
    public readonly tipoInmuebleId: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  get estado(): EstadoInmueble {
    return this._estado;
  }

  // --- MÁQUINA DE ESTADOS ---

  reservar(): void {
    if (this._estado !== EstadoInmueble.DISPONIBLE) {
      throw new BadRequestException(`Solo se pueden reservar inmuebles disponibles. Estado actual: ${this._estado}`);
    }
    this._estado = EstadoInmueble.RESERVADO;
  }

  vender(): void {
    if (this._estado === EstadoInmueble.VENDIDO) {
      throw new BadRequestException('El inmueble ya ha sido vendido previamente.');
    }
    if (this._estado !== EstadoInmueble.DISPONIBLE) {
      throw new BadRequestException(`Solo se pueden vender inmuebles disponibles. (Si estaba reservado, debe liberarse primero o implementar esa transición si el negocio lo requiere. Según reglas estrictas: DISPONIBLE -> VENDIDO)`);
    }
    this._estado = EstadoInmueble.VENDIDO;
  }

  liberar(): void {
    if (this._estado !== EstadoInmueble.RESERVADO) {
      throw new BadRequestException(`Solo se pueden liberar inmuebles reservados. Estado actual: ${this._estado}`);
    }
    this._estado = EstadoInmueble.DISPONIBLE;
  }
}
