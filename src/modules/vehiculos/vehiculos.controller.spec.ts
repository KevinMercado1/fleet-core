import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehiculos.controller.js';
import { VehiclesService } from './vehiculos.service.js';
import { VehicleStatus } from './entities/vehiculo.entity.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('VehiclesController', () => {
  let controller: VehiclesController;
  let service: VehiclesService;

  const mockVehiclesService = {
    create: vi.fn().mockImplementation((dto: any) =>
      Promise.resolve({
        id: 'uuid-1',
        ...dto,
        status: VehicleStatus.AVAILABLE,
      }),
    ),
    findAll: vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve([{ id: 'uuid-1', plate: 'ABC-123' }]),
      ),
    findOne: vi
      .fn()
      .mockImplementation((id: any) =>
        Promise.resolve({ id, plate: 'ABC-123' }),
      ),
    update: vi
      .fn()
      .mockImplementation((id: any, dto: any) =>
        Promise.resolve({ id, ...dto }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [
        {
          provide: VehiclesService,
          useValue: mockVehiclesService,
        },
      ],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    service = module.get<VehiclesService>(VehiclesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all vehicles', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 'uuid-1', plate: 'ABC-123' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create a vehicle', async () => {
    const dto = {
      plate: 'XYZ-123',
      brand: 'Freightliner',
      model: 'M2',
      year: 2023,
      mileage: 12000,
    };

    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
    expect(result.plate).toBe('XYZ-123');
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
