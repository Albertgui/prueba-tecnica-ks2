import { Test, TestingModule } from '@nestjs/testing';
import { InmueblesService } from './inmuebles.service';
import { InmueblesRepository } from '../infrastructure/inmuebles.repository';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { InmuebleEntity } from '../domain/inmueble.entity';
import { EstadoInmueble } from '@prisma/client';

describe('InmueblesService', () => {
  let service: InmueblesService;
  let repository: InmueblesRepository;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    updateState: jest.fn(),
    softDelete: jest.fn(),
  };

  const createMockInmueble = (
    estado: EstadoInmueble,
    vendedorId = 'vendedor-1',
  ) =>
    new InmuebleEntity(
      'inmueble-1',
      'Calle 123',
      1000,
      2,
      50,
      estado,
      vendedorId,
      'tipo-1',
      new Date(),
      new Date(),
    );

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InmueblesService,
        {
          provide: InmueblesRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<InmueblesService>(InmueblesService);
    repository = module.get<InmueblesRepository>(InmueblesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an inmueble', async () => {
      const dto = {
        direccion: 'A',
        precio: 1,
        habitaciones: 1,
        metrosCuadrados: 1,
        tipoInmuebleId: 'T1',
      };
      mockRepository.create.mockResolvedValue('created');
      const result = await service.create('vendedor-1', dto);
      expect(result).toBe('created');
      expect(repository.create).toHaveBeenCalledWith('vendedor-1', dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated result', async () => {
      mockRepository.findAll.mockResolvedValue('paginated');
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result).toBe('paginated');
      expect(repository.findAll).toHaveBeenCalledWith(
        { page: 1, limit: 10 },
        undefined,
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if not found', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should return inmueble', async () => {
      const mock = createMockInmueble(EstadoInmueble.DISPONIBLE);
      mockRepository.findById.mockResolvedValue(mock);
      const result = await service.findOne('1');
      expect(result).toBe(mock);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if trying to update someone elses inmueble', async () => {
      const mock = createMockInmueble(EstadoInmueble.DISPONIBLE, 'vendedor-2');
      mockRepository.findById.mockResolvedValue(mock);
      await expect(service.update('1', 'vendedor-1', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if trying to update a VENDIDO inmueble', async () => {
      const mock = createMockInmueble(EstadoInmueble.VENDIDO, 'vendedor-1');
      mockRepository.findById.mockResolvedValue(mock);
      await expect(service.update('1', 'vendedor-1', {})).rejects.toThrow(
        ConflictException,
      );
    });

    it('should update successfully', async () => {
      const mock = createMockInmueble(EstadoInmueble.DISPONIBLE, 'vendedor-1');
      mockRepository.findById.mockResolvedValue(mock);
      mockRepository.update.mockResolvedValue(undefined);

      const result = await service.update('1', 'vendedor-1', { precio: 2000 });
      expect(repository.update).toHaveBeenCalledWith('1', { precio: 2000 });
      expect(result).toBe(mock);
    });
  });

  describe('cambiarEstado', () => {
    it('should throw NotFoundException if not owner', async () => {
      const mock = createMockInmueble(EstadoInmueble.DISPONIBLE, 'vendedor-2');
      mockRepository.findById.mockResolvedValue(mock);
      await expect(
        service.cambiarEstado('1', 'vendedor-1', EstadoInmueble.RESERVADO),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if transition is invalid', async () => {
      const mock = createMockInmueble(EstadoInmueble.DISPONIBLE, 'vendedor-1');
      mockRepository.findById.mockResolvedValue(mock);

      await expect(
        service.cambiarEstado('1', 'vendedor-1', EstadoInmueble.VENDIDO),
      ).rejects.toThrow(ConflictException);
    });

    it('should change state successfully', async () => {
      const mock = createMockInmueble(EstadoInmueble.DISPONIBLE, 'vendedor-1');
      mockRepository.findById.mockResolvedValue(mock);

      const result = await service.cambiarEstado(
        '1',
        'vendedor-1',
        EstadoInmueble.RESERVADO,
      );
      expect(mock.estado).toBe(EstadoInmueble.RESERVADO);
      expect(repository.updateState).toHaveBeenCalledWith(
        '1',
        EstadoInmueble.RESERVADO,
      );
      expect(result).toEqual({
        success: true,
        estado: EstadoInmueble.RESERVADO,
      });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if not owner', async () => {
      const mock = createMockInmueble(EstadoInmueble.DISPONIBLE, 'vendedor-2');
      mockRepository.findById.mockResolvedValue(mock);
      await expect(service.remove('1', 'vendedor-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should soft delete successfully', async () => {
      const mock = createMockInmueble(EstadoInmueble.DISPONIBLE, 'vendedor-1');
      mockRepository.findById.mockResolvedValue(mock);
      mockRepository.softDelete.mockResolvedValue(undefined);

      const result = await service.remove('1', 'vendedor-1');
      expect(repository.softDelete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ success: true, message: 'Inmueble eliminado' });
    });
  });
});
