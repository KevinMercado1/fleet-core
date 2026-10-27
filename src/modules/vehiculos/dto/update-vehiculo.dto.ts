import { PartialType } from '@nestjs/swagger';
import { CreateVehicleDto } from './create-vehiculo.dto.js';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus } from '../entities/vehiculo.entity.js';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiProperty({
    enum: VehicleStatus,
    example: VehicleStatus.INACTIVE,
    required: false,
  })
  @IsEnum(VehicleStatus)
  @IsOptional()
  status?: VehicleStatus;
}
