import { InmuebleEntity } from './inmueble.entity';
import { EstadoInmueble } from '@prisma/client';
import { ConflictException } from '@nestjs/common';

describe('InmuebleEntity', () => {
  let entity: InmuebleEntity;
  const date = new Date();

  beforeEach(() => {
    entity = new InmuebleEntity(
      'inmueble-1',
      'Calle 123',
      100000,
      3,
      120,
      EstadoInmueble.DISPONIBLE,
      'user-1',
      'tipo-1',
      date,
      date,
    );
  });

  describe('cambiarEstado', () => {
    it('should change state from DISPONIBLE to RESERVADO', () => {
      entity.cambiarEstado(EstadoInmueble.RESERVADO);
      expect(entity.estado).toBe(EstadoInmueble.RESERVADO);
    });

    it('should throw ConflictException if already RESERVADO and try to RESERVADO', () => {
      entity.cambiarEstado(EstadoInmueble.RESERVADO);
      expect(() => entity.cambiarEstado(EstadoInmueble.RESERVADO)).toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if VENDIDO and try to change state', () => {
      entity.cambiarEstado(EstadoInmueble.RESERVADO);
      entity.cambiarEstado(EstadoInmueble.VENDIDO);
      expect(() => entity.cambiarEstado(EstadoInmueble.DISPONIBLE)).toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if trying to sell DISPONIBLE', () => {
      expect(() => entity.cambiarEstado(EstadoInmueble.VENDIDO)).toThrow(
        ConflictException,
      );
    });

    it('should change state to VENDIDO if RESERVADO', () => {
      entity.cambiarEstado(EstadoInmueble.RESERVADO);
      entity.cambiarEstado(EstadoInmueble.VENDIDO);
      expect(entity.estado).toBe(EstadoInmueble.VENDIDO);
    });

    it('should change state to DISPONIBLE if RESERVADO', () => {
      entity.cambiarEstado(EstadoInmueble.RESERVADO);
      entity.cambiarEstado(EstadoInmueble.DISPONIBLE);
      expect(entity.estado).toBe(EstadoInmueble.DISPONIBLE);
    });

    it('should throw ConflictException if trying to make DISPONIBLE when already DISPONIBLE', () => {
      expect(() => entity.cambiarEstado(EstadoInmueble.DISPONIBLE)).toThrow(
        ConflictException,
      );
    });
  });

  describe('toJSON', () => {
    it('should serialize correctly', () => {
      const json = entity.toJSON();
      expect(json.estado).toBe(EstadoInmueble.DISPONIBLE);
      expect(json._estado).toBeUndefined();
    });
  });
});
