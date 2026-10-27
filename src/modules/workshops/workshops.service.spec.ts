import { Test, TestingModule } from '@nestjs/testing';
import { WorkshopsService } from './workshops.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkshopEntity } from './entities/workshop.entity.js';
import { NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('WorkshopsService', () => {
  let service: WorkshopsService;
  let workshopRepo: any;

  const mockRepository = () => ({
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn().mockImplementation((dto: any) => dto),
    save: vi
      .fn()
      .mockImplementation((entity: any) =>
        Promise.resolve({ id: 'uuid-workshop', ...entity }),
      ),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkshopsService,
        {
          provide: getRepositoryToken(WorkshopEntity),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WorkshopsService>(WorkshopsService);
    workshopRepo = module.get(getRepositoryToken(WorkshopEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should successfully create a workshop', async () => {
    const createDto = {
      name: 'Taller Central Norte',
      address: 'Calle 100 # 15-20',
      phone: '3001234567',
    };

    const result = await service.create(createDto);
    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Taller Central Norte');
  });

  it('should throw NotFoundException if workshop does not exist', async () => {
    workshopRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
