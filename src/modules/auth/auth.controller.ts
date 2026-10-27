import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto, LoginDto } from './dto/auth.dto.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

const Public = () => SetMetadata('isPublic', true);

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, retorna el token access_token.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
