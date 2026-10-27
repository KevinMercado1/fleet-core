import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity, UserRole } from './entities/user.entity.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: any;

  const mockRepository = () => ({
    findOne: vi.fn(),
    find: vi.fn(),
    create: vi.fn().mockImplementation((dto: any) => dto),
    save: vi
      .fn()
      .mockImplementation((entity: any) =>
        Promise.resolve({ id: 'uuid-user', ...entity }),
      ),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(UserEntity), useFactory: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw ConflictException if user email already exists', async () => {
    const createDto = {
      email: 'admin@fleetcore.com',
      password: 'hashedpassword',
      role: UserRole.ADMIN,
    };

    userRepo.findOne.mockResolvedValue({ id: 'existing-id', ...createDto });

    await expect(service.create(createDto)).rejects.toThrow(ConflictException);
  });

  it('should throw NotFoundException if user is not found by ID', async () => {
    userRepo.findOne.mockResolvedValue(null);

    await expect(service.findById('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
