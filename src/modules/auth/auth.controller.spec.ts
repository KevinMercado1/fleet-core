import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: vi.fn().mockResolvedValue({ access_token: 'test-token' }),
    register: vi
      .fn()
      .mockResolvedValue({ id: 'user-id', email: 'test@fleetcore.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
