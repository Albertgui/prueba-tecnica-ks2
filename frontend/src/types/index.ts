export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EstadoInmueble = 'DISPONIBLE' | 'RESERVADO' | 'VENDIDO';

export interface TipoInmueble {
  id: string;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export interface Inmueble {
  id: string;
  direccion: string;
  precio: number;
  habitaciones: number;
  metrosCuadrados: number;
  estado: EstadoInmueble;
  vendedorId: string;
  tipoInmuebleId: string;
  createdAt: string;
  updatedAt: string;
  vendedor?: Pick<Usuario, 'id' | 'nombre' | 'email'>;
  tipoInmueble?: TipoInmueble;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
