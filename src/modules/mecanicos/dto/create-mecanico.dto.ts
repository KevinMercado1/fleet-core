import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { MechanicSpecialization } from '../entities/mecanico.entity.js';

export class CreateMechanicDto {
  @ApiProperty({ example: 'John Doe', description: 'Mechanic full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.mechanic@fleetcore.com',
    description: 'Mechanic email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    enum: MechanicSpecialization,
    example: MechanicSpecialization.ENGINE,
    description: 'Area of expertise',
  })
  @IsEnum(MechanicSpecialization)
  specialization: MechanicSpecialization;
}

export class UpdateMechanicDto extends PartialType(CreateMechanicDto) {
  @ApiProperty({
    example: true,
    description: 'Mechanic active status',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
