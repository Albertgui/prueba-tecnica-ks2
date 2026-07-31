import { ConflictException } from '@nestjs/common';
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

  cambiarEstado(nuevoEstado: EstadoInmueble): void {
    if (this._estado === EstadoInmueble.VENDIDO) {
      throw new ConflictException(
        'Un inmueble vendido no puede cambiar de estado.',
      );
    }

    if (
      nuevoEstado === EstadoInmueble.RESERVADO &&
      this._estado !== EstadoInmueble.DISPONIBLE
    ) {
      throw new ConflictException(
        'Solo se pueden reservar inmuebles disponibles.',
      );
    }

    if (
      nuevoEstado === EstadoInmueble.VENDIDO &&
      this._estado !== EstadoInmueble.DISPONIBLE
    ) {
      throw new ConflictException(
        'Solo se pueden vender inmuebles disponibles.',
      );
    }

    if (
      nuevoEstado === EstadoInmueble.DISPONIBLE &&
      this._estado !== EstadoInmueble.RESERVADO
    ) {
      throw new ConflictException(
        'Solo se pueden liberar (hacer disponibles) inmuebles reservados.',
      );
    }

    this._estado = nuevoEstado;
  }
}
