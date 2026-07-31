import { EstadoInmueble } from '@prisma/client';

export class InvalidStateTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStateTransitionError';
  }
}

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
    public readonly vendedor?: any,
    public readonly tipoInmueble?: any,
  ) {}

  get estado(): EstadoInmueble {
    return this._estado;
  }

  cambiarEstado(nuevoEstado: EstadoInmueble): void {
    if (this._estado === EstadoInmueble.VENDIDO) {
      throw new InvalidStateTransitionError(
        'Un inmueble vendido no puede cambiar de estado.',
      );
    }

    if (nuevoEstado === EstadoInmueble.RESERVADO) {
      if (this._estado !== EstadoInmueble.DISPONIBLE) {
        throw new InvalidStateTransitionError(
          'Solo se pueden reservar inmuebles disponibles.',
        );
      }
    } else if (nuevoEstado === EstadoInmueble.VENDIDO) {
      if (
        this._estado !== EstadoInmueble.DISPONIBLE &&
        this._estado !== EstadoInmueble.RESERVADO
      ) {
        throw new InvalidStateTransitionError(
          'Solo se pueden vender inmuebles disponibles o reservados.',
        );
      }
    } else if (nuevoEstado === EstadoInmueble.DISPONIBLE) {
      if (this._estado !== EstadoInmueble.RESERVADO) {
        throw new InvalidStateTransitionError(
          'Solo se pueden liberar (hacer disponibles) inmuebles reservados.',
        );
      }
    }

    this._estado = nuevoEstado;
  }

  toJSON() {
    const obj = { ...this } as any;
    delete obj._estado;
    return {
      ...obj,
      estado: this.estado,
    };
  }
}
