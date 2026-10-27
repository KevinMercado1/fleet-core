import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  MaintenanceType,
  MaintenanceStatus,
} from '../entities/maintenance.entity.js';

export class CreateMaintenanceDto {
  @ApiProperty({ enum: MaintenanceType, example: MaintenanceType.PREVENTIVE })
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @ApiProperty({ example: 'General oil change and brake inspection' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-11-01T08:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-11-01T12:00:00Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'uuid-vehicle-id' })
  @IsUUID()
  vehicleId: string;

  @ApiProperty({ example: 'uuid-mechanic-id' })
  @IsUUID()
  mechanicId: string;

  @ApiProperty({ example: 'uuid-workshop-id' })
  @IsUUID()
  workshopId: string;
}

export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {
  @ApiProperty({
    enum: MaintenanceStatus,
    example: MaintenanceStatus.COMPLETED,
    required: false,
  })
  @IsEnum(MaintenanceStatus)
  @IsOptional()
  status?: MaintenanceStatus;
}
