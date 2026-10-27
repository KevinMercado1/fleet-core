import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findOne: vi.fn(),
    findByEmail: vi.fn(),
    create: vi.fn(),
  };

  const mockJwtService = {
    sign: vi.fn().mockReturnValue('test-token'),
    signAsync: vi.fn().mockResolvedValue('test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
