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
import { MechanicsService } from './mecanicos.service.js';
import {
  CreateMechanicDto,
  UpdateMechanicDto,
} from './dto/create-mecanico.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

@ApiTags('Mechanics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('mechanics')
export class MechanicsController {
  constructor(private readonly mechanicsService: MechanicsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all registered mechanics' })
  @ApiResponse({ status: 200, description: 'Return all mechanics.' })
  async findAll() {
    return this.mechanicsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific mechanic by ID' })
  @ApiResponse({ status: 200, description: 'Return mechanic details.' })
  async findOne(@Param('id') id: string) {
    return this.mechanicsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Register a new mechanic (Admin only)' })
  @ApiResponse({ status: 201, description: 'Mechanic successfully created.' })
  async create(@Body() createMechanicDto: CreateMechanicDto) {
    return this.mechanicsService.create(createMechanicDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update mechanic information or toggle status (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Mechanic successfully updated.' })
  async update(
    @Param('id') id: string,
    @Body() updateMechanicDto: UpdateMechanicDto,
  ) {
    return this.mechanicsService.update(id, updateMechanicDto);
  }
}
