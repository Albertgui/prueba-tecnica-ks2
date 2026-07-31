import { Test, TestingModule } from '@nestjs/testing';
import { TiposInmuebleService } from './tipos-inmueble.service';
import { TiposInmuebleRepository } from '../infrastructure/tipos-inmueble.repository';
import { CreateTipoInmuebleDto } from '../infrastructure/dto/create-tipo-inmueble.dto';

describe('TiposInmuebleService', () => {
  let service: TiposInmuebleService;
  let repository: TiposInmuebleRepository;

  const mockRepository = {
    findAll: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiposInmuebleService,
        {
          provide: TiposInmuebleRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TiposInmuebleService>(TiposInmuebleService);
    repository = module.get<TiposInmuebleRepository>(TiposInmuebleRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tipos', async () => {
      const result = [{ id: '1', codigo: 'CASA', nombre: 'Casa', activo: true }];
      mockRepository.findAll.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create and return a new tipo', async () => {
      const dto: CreateTipoInmuebleDto = { codigo: 'APTO', nombre: 'Apartamento' };
      const expectedResult = { id: '2', ...dto, activo: true };
      mockRepository.create.mockResolvedValue(expectedResult);

      expect(await service.create(dto)).toEqual(expectedResult);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.create).toHaveBeenCalledTimes(1);
    });
  });
});
