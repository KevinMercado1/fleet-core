import { Test, TestingModule } from '@nestjs/testing';
import { MaintenancesController } from './maintenances.controller.js';
import { MaintenancesService } from './maintenances.service.js';
import {
  MaintenanceStatus,
  MaintenanceType,
} from './entities/maintenance.entity.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MaintenancesController', () => {
  let controller: MaintenancesController;
  let service: MaintenancesService;

  const mockMaintenancesService = {
    create: vi.fn().mockImplementation((dto: any) =>
      Promise.resolve({
        id: 'uuid-1',
        ...dto,
        status: MaintenanceStatus.SCHEDULED,
      }),
    ),
    findAll: vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve([{ id: 'uuid-1', description: 'Preventive check' }]),
      ),
    findOne: vi
      .fn()
      .mockImplementation((id: any) =>
        Promise.resolve({ id, description: 'Preventive check' }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenancesController],
      providers: [
        {
          provide: MaintenancesService,
          useValue: mockMaintenancesService,
        },
      ],
    }).compile();

    controller = module.get<MaintenancesController>(MaintenancesController);
    service = module.get<MaintenancesService>(MaintenancesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all maintenances', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 'uuid-1', description: 'Preventive check' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create a maintenance schedule', async () => {
    const dto = {
      vehicleId: 'uuid-vehicle',
      mechanicId: 'uuid-mechanic',
      workshopId: 'uuid-workshop',
      description: 'General revision',
      scheduledDate: new Date().toISOString(),
      type: MaintenanceType.PREVENTIVE,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };

    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
    expect(result.status).toBe(MaintenanceStatus.SCHEDULED);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
