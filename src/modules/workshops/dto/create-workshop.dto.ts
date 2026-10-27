import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateWorkshopDto {
  @ApiProperty({
    example: 'Central Fleet Workshop',
    description: 'Workshop name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '123 Main Street, City',
    description: 'Workshop physical address',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class UpdateWorkshopDto extends PartialType(CreateWorkshopDto) {
  @ApiProperty({
    example: true,
    description: 'Workshop active status',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
