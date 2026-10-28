import { Test, TestingModule } from '@nestjs/testing';
import { MaintenancesService } from './maintenances.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MaintenanceEntity,
  MaintenanceType,
} from './entities/maintenance.entity.js';
import { VehicleEntity } from '../vehiculos/entities/vehiculo.entity.js';
import { MechanicEntity } from '../mecanicos/entities/mecanico.entity.js';
import { WorkshopEntity } from '../workshops/entities/workshop.entity.js';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MaintenancesService', () => {
  let service: MaintenancesService;
  let _maintenanceRepo: any;
  let vehicleRepo: any;
  let _mechanicRepo: any;

  const mockRepository = () => ({
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn().mockImplementation((dto: any) => dto),
    save: vi
      .fn()
      .mockImplementation((entity: any) =>
        Promise.resolve({ id: 'uuid-maint', ...entity }),
      ),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenancesService,
        {
          provide: getRepositoryToken(MaintenanceEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(VehicleEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(MechanicEntity),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(WorkshopEntity),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MaintenancesService>(MaintenancesService);
    _maintenanceRepo = module.get(getRepositoryToken(MaintenanceEntity));
    vehicleRepo = module.get(getRepositoryToken(VehicleEntity));
    _mechanicRepo = module.get(getRepositoryToken(MechanicEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if vehicle does not exist when scheduling maintenance', async () => {
    const dto = {
      vehicleId: 'invalid-vehicle',
      mechanicId: 'uuid-mech',
      workshopId: 'uuid-workshop',
      description: 'Preventive check',
      scheduledDate: new Date(),
      type: MaintenanceType.PREVENTIVE,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      mileage: 45000,
    };

    vehicleRepo.findOne.mockResolvedValue(null);

    await expect(service.create(dto)).rejects.toThrow(NotFoundException);
  });
});
