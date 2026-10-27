import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity.js';

export class RegisterDto {
  @ApiProperty({
    example: 'technician@fleetcore.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña segura (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.TECHNICIAN,
    description: 'Rol del usuario dentro del sistema',
  })
  @IsEnum(UserRole)
  role: UserRole;
}

export class LoginDto {
  @ApiProperty({
    example: 'technician@fleetcore.com',
    description: 'Correo electrónico registrado',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Contraseña de acceso',
  })
  @IsString()
  password: string;
}
