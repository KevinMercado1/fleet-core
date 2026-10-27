import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehiculos.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleEntity, VehicleStatus } from './entities/vehiculo.entity.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let vehicleRepo: any;

  const mockRepository = () => ({
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn().mockImplementation((dto: any) => dto),
    save: vi.fn().mockImplementation((entity: any) =>
      Promise.resolve({
        id: 'uuid-vehicle',
        ...entity,
        status: entity.status ?? VehicleStatus.AVAILABLE,
      }),
    ),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        {
          provide: getRepositoryToken(VehicleEntity),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    vehicleRepo = module.get(getRepositoryToken(VehicleEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ConflictException if vehicle plate already exists', async () => {
    const createDto = {
      plate: 'XYZ-999',
      brand: 'Volvo',
      model: 'FH16',
      year: 2024,
      mileage: 1000,
    };

    vehicleRepo.findOne.mockResolvedValue({ id: 'existing-id', ...createDto });

    await expect(service.create(createDto)).rejects.toThrow(ConflictException);
  });

  it('should successfully create a vehicle if plate is unique', async () => {
    const createDto = {
      plate: 'NEW-123',
      brand: 'Scania',
      model: 'R500',
      year: 2025,
      mileage: 500,
    };

    vehicleRepo.findOne.mockResolvedValue(null);

    const result = await service.create(createDto);
    expect(result).toHaveProperty('id');
    expect(result.plate).toBe('NEW-123');
    expect(result.status).toBe(VehicleStatus.AVAILABLE);
  });

  it('should throw NotFoundException if vehicle does not exist', async () => {
    vehicleRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne('invalid-uuid')).rejects.toThrow(
      NotFoundException,
    );
  });
});
