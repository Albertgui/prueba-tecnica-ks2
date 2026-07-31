import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuariosRepository } from '../../usuarios/infrastructure/usuarios.repository';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../infrastructure/dto/register.dto';
import { LoginDto } from '../infrastructure/dto/login.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUsuariosRepository = {
    findByEmail: jest.fn(),
  };

  const mockPrismaService = {
    usuario: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
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
        AuthService,
        {
          provide: UsuariosRepository,
          useValue: mockUsuariosRepository,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      nombre: 'New User',
      email: 'new@test.com',
      password: 'password123',
    };

    it('should throw BadRequestException if email already exists', async () => {
      mockUsuariosRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should hash password, create user and return access_token', async () => {
      mockUsuariosRepository.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newhashed');
      mockPrismaService.usuario.create.mockResolvedValue({
        id: 'user-new',
        email: 'new@test.com',
      });
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.usuario.create).toHaveBeenCalledWith({
        data: {
          nombre: 'New User',
          email: 'new@test.com',
          password: 'newhashed',
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'new@test.com',
        sub: 'user-new',
      });
      expect(result).toEqual({ access_token: 'jwt-token' });
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'password123',
    };

    it('should throw UnauthorizedException if user not found', async () => {
      mockUsuariosRepository.findByEmail.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      mockUsuariosRepository.findByEmail.mockResolvedValue({
        ...mockUser,
        activo: false,
      });
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockUsuariosRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return access_token on successful login', async () => {
      mockUsuariosRepository.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashedpassword',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'test@test.com',
        sub: 'user-123',
      });
      expect(result).toEqual({ access_token: 'jwt-token' });
    });
  });
});
