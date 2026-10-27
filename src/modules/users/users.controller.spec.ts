import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { UserRole } from './entities/user.entity.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          { id: 'uuid-1', email: 'admin@fleetcore.com', role: UserRole.ADMIN },
        ]),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([
      { id: 'uuid-1', email: 'admin@fleetcore.com', role: UserRole.ADMIN },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });
});
