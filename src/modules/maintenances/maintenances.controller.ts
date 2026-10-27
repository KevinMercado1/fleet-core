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
import { MaintenancesService } from './maintenances.service.js';
import {
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
} from './dto/create-maintenance.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

@ApiTags('Maintenances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('maintenances')
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all maintenances' })
  @ApiResponse({ status: 200, description: 'Return all maintenances.' })
  async findAll() {
    return this.maintenancesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific maintenance by ID' })
  @ApiResponse({ status: 200, description: 'Return maintenance details.' })
  async findOne(@Param('id') id: string) {
    return this.maintenancesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Schedule a new maintenance (Admin/Manager)' })
  @ApiResponse({
    status: 201,
    description: 'Maintenance successfully scheduled.',
  })
  @ApiResponse({ status: 409, description: 'Mechanic schedule conflict.' })
  async create(@Body() createDto: CreateMaintenanceDto) {
    return this.maintenancesService.create(createDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update maintenance status or details' })
  @ApiResponse({
    status: 200,
    description: 'Maintenance successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMaintenanceDto,
  ) {
    return this.maintenancesService.update(id, updateDto);
  }
}
