import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC123', description: 'Unique vehicle plate' })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({ example: 'Chevrolet', description: 'Vehicle brand' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: 'NPR', description: 'Vehicle model' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2022, description: 'Manufacturing year' })
  @IsInt()
  year: number;

  @ApiProperty({ example: 45000, description: 'Current vehicle mileage' })
  @IsInt()
  @Min(0)
  mileage: number;
}
