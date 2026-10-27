import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { VehiclesService } from './vehiculos.service.js';
import { CreateVehicleDto } from './dto/create-vehiculo.dto.js';
import { UpdateVehicleDto } from './dto/update-vehiculo.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

@ApiTags('Vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all registered vehicles' })
  @ApiResponse({ status: 200, description: 'Return all vehicles.' })
  async findAll() {
    return this.vehiclesService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Register a new vehicle (Admin only)' })
  @ApiResponse({ status: 201, description: 'Vehicle successfully created.' })
  @ApiResponse({ status: 409, description: 'Plate already exists.' })
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update vehicle information or status (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Vehicle successfully updated.' })
  @ApiResponse({ status: 404, description: 'Vehicle not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }
}
