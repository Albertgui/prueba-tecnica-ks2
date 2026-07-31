import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { UsuariosRepository } from '../infrastructure/usuarios.repository';
import { NotFoundException } from '@nestjs/common';
import { UpdateUsuarioDto } from '../infrastructure/dto/update-usuario.dto';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repository: UsuariosRepository;

  const mockRepository = {
    findAllPaginated: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockUser = {
    id: 'user-123',
    nombre: 'Test User',
    email: 'test@test.com',
    password: 'hashedpassword',
    activo: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: UsuariosRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    repository = module.get<UsuariosRepository>(UsuariosRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const expected = { data: [mockUser], meta: { total: 1, page: 1 } };
      mockRepository.findAllPaginated.mockResolvedValue(expected);

      const result = await service.findAll(1, 10);
      expect(result).toEqual(expected);
      expect(repository.findAllPaginated).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return user without password', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne('user-123');
      expect('password' in result).toBeFalsy();
      expect(result.nombre).toEqual('Test User');
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.update('invalid', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update and return user', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue(undefined);

      const dto: UpdateUsuarioDto = { nombre: 'Updated' };
      const result = await service.update('user-123', dto);

      expect(repository.update).toHaveBeenCalledWith('user-123', dto);
      expect(result.nombre).toEqual('Test User');
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(service.remove('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should soft delete user and return success', async () => {
      mockRepository.findById.mockResolvedValue(mockUser);
      mockRepository.softDelete.mockResolvedValue(undefined);

      const result = await service.remove('user-123');
      expect(repository.softDelete).toHaveBeenCalledWith('user-123');
      expect(result).toEqual({ success: true, message: 'Usuario eliminado' });
    });
  });
});
