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
import { WorkshopsService } from './workshops.service.js';
import {
  CreateWorkshopDto,
  UpdateWorkshopDto,
} from './dto/create-workshop.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

@ApiTags('Workshops')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all registered workshops' })
  @ApiResponse({ status: 200, description: 'Return all workshops.' })
  async findAll() {
    return this.workshopsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific workshop by ID' })
  @ApiResponse({ status: 200, description: 'Return workshop details.' })
  async findOne(@Param('id') id: string) {
    return this.workshopsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Register a new workshop (Admin only)' })
  @ApiResponse({ status: 201, description: 'Workshop successfully created.' })
  async create(@Body() createWorkshopDto: CreateWorkshopDto) {
    return this.workshopsService.create(createWorkshopDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update workshop information or toggle status (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Workshop successfully updated.' })
  async update(
    @Param('id') id: string,
    @Body() updateWorkshopDto: UpdateWorkshopDto,
  ) {
    return this.workshopsService.update(id, updateWorkshopDto);
  }
}
