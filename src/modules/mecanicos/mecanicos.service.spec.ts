import { Test, TestingModule } from '@nestjs/testing';
import { MechanicsService } from './mecanicos.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  MechanicEntity,
  MechanicSpecialization,
} from './entities/mecanico.entity.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('MechanicsService', () => {
  let service: MechanicsService;
  let mechanicRepo: any;

  const mockRepository = () => ({
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn().mockImplementation((dto: any) => dto),
    save: vi
      .fn()
      .mockImplementation((entity: any) =>
        Promise.resolve({ id: 'uuid-mech', ...entity }),
      ),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MechanicsService,
        {
          provide: getRepositoryToken(MechanicEntity),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MechanicsService>(MechanicsService);
    mechanicRepo = module.get(getRepositoryToken(MechanicEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ConflictException if mechanic email already exists', async () => {
    const createDto = {
      name: 'Carlos Ruiz',
      email: 'carlos@fleetcore.com',
      specialization: MechanicSpecialization.ELECTRICAL,
    };

    mechanicRepo.findOne.mockResolvedValue({ id: 'existing-id', ...createDto });

    await expect(service.create(createDto)).rejects.toThrow(ConflictException);
  });

  it('should successfully create a mechanic if email is unique', async () => {
    const createDto = {
      name: 'Ana Gomez',
      email: 'ana@fleetcore.com',
      specialization: MechanicSpecialization.ENGINE,
    };

    mechanicRepo.findOne.mockResolvedValue(null);

    const result = await service.create(createDto);
    expect(result).toHaveProperty('id');
    expect(result.email).toBe('ana@fleetcore.com');
  });

  it('should throw NotFoundException if mechanic does not exist', async () => {
    mechanicRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
