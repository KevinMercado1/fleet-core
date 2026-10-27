import { PartialType } from '@nestjs/swagger';
import { CreateMechanicDto } from './create-mecanico.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
