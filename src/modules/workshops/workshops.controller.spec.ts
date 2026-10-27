import { Test, TestingModule } from '@nestjs/testing';
import { WorkshopsController } from './workshops.controller.js';
import { WorkshopsService } from './workshops.service.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('WorkshopsController', () => {
  let controller: WorkshopsController;
  let service: WorkshopsService;

  const mockWorkshopsService = {
    create: vi
      .fn()
      .mockImplementation((dto: any) =>
        Promise.resolve({ id: 'uuid-1', ...dto, isActive: true }),
      ),
    findAll: vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve([{ id: 'uuid-1', name: 'Taller Central' }]),
      ),
    findOne: vi
      .fn()
      .mockImplementation((id: any) =>
        Promise.resolve({ id, name: 'Taller Central' }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkshopsController],
      providers: [
        {
          provide: WorkshopsService,
          useValue: mockWorkshopsService,
        },
      ],
    }).compile();

    controller = module.get<WorkshopsController>(WorkshopsController);
    service = module.get<WorkshopsService>(WorkshopsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all workshops', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 'uuid-1', name: 'Taller Central' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should create a workshop', async () => {
    const dto = {
      name: 'Taller Norte',
      address: 'Calle 123',
      phone: '3000000000',
    };

    const result = await controller.create(dto);
    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Taller Norte');
    expect(service.create).toHaveBeenCalledWith(dto);
  });
});
