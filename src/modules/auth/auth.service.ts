import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { RegisterDto, LoginDto } from './dto/auth.dto.js';
import { UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Note: Make sure to hash the password in your UsersService or right here before saving it.
    // Example using bcrypt: const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.usersService.create({
      ...registerDto,
      role: UserRole.TECHNICIAN, // Default role for new users
    });
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials'); // Check if the user exists in the database
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials'); // Check if the provided password matches the hashed password in the database
    }

    const payload = { sub: user.id, email: user.email, role: user.role }; // Create a payload for the JWT token containing the user's ID, email, and role
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
