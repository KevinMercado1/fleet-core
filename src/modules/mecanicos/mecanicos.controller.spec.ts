import { Test, TestingModule } from '@nestjs/testing';
import { MechanicsController } from './mecanicos.controller.js';
import { MechanicsService } from './mecanicos.service.js';
import { MechanicSpecialization } from './entities/mecanico.entity.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MechanicsController', () => {
  let controller: MechanicsController;
  let service: MechanicsService;

  const mockMechanicsService = {
    create: vi
      .fn()
      .mockImplementation((dto: any) =>
        Promise.resolve({ id: 'uuid-1', ...dto, isActive: true }),
      ),
    findAll: vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve([{ id: 'uuid-1', name: 'Carlos Ruiz' }]),
      ),
    findOne: vi
      .fn()
      .mockImplementation((id: any) =>
        Promise.resolve({ id, name: 'Carlos Ruiz' }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MechanicsController],
      providers: [
        {
          provide: MechanicsService,
          useValue: mockMechanicsService,
        },
      ],
    }).compile();

    controller = module.get<MechanicsController>(MechanicsController);
    service = module.get<MechanicsService>(MechanicsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all mechanics', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 'uuid-1', name: 'Carlos Ruiz' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create a mechanic', async () => {
    const dto = {
      name: 'Carlos Ruiz',
      email: 'carlos@fleetcore.com',
      specialization: MechanicSpecialization.ELECTRICAL,
    };

    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Carlos Ruiz');
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
