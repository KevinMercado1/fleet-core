import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import {
  MaintenanceEntity,
  MaintenanceStatus,
} from './entities/maintenance.entity.js';
import {
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
} from './dto/create-maintenance.dto.js';
import {
  VehicleEntity,
  VehicleStatus,
} from '../vehiculos/entities/vehiculo.entity.js';
import { MechanicEntity } from '../mecanicos/entities/mecanico.entity.js';
import { WorkshopEntity } from '../workshops/entities/workshop.entity.js';

@Injectable()
export class MaintenancesService {
  constructor(
    // Injecting repositories for Maintenance, Vehicle, Mechanic, and Workshop entities

    @InjectRepository(MaintenanceEntity)
    private readonly maintenanceRepository: Repository<MaintenanceEntity>,
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
    @InjectRepository(MechanicEntity)
    private readonly mechanicRepository: Repository<MechanicEntity>,
    @InjectRepository(WorkshopEntity)
    private readonly workshopRepository: Repository<WorkshopEntity>,
  ) {}

  async create(createDto: CreateMaintenanceDto): Promise<MaintenanceEntity> {
    const start = new Date(createDto.startDate);
    const end = new Date(createDto.endDate);

    if (start >= end) {
      throw new BadRequestException('Start date must be earlier than end date');
    }

    // 1. Validate Vehicle
    const vehicle = await this.vehicleRepository.findOne({
      where: { id: createDto.vehicleId },
    });
    if (!vehicle || vehicle.status === VehicleStatus.INACTIVE) {
      throw new NotFoundException('Vehicle not found or inactive');
    }

    // 2. Validate Mechanic & Schedule Conflict
    const mechanic = await this.mechanicRepository.findOne({
      where: { id: createDto.mechanicId },
    });
    if (!mechanic || !mechanic.isActive) {
      throw new NotFoundException('Mechanic not found or inactive');
    }

    // Check overlapping maintenance for the mechanic
    const overlapping = await this.maintenanceRepository.findOne({
      where: {
        mechanicId: createDto.mechanicId,
        status: Not(MaintenanceStatus.CANCELLED),
        startDate: LessThanOrEqual(end),
        endDate: MoreThanOrEqual(start),
      },
    });

    if (overlapping) {
      throw new ConflictException(
        'Mechanic already has a scheduled maintenance during this time frame',
      );
    }

    // 3. Validate Workshop
    const workshop = await this.workshopRepository.findOne({
      where: { id: createDto.workshopId },
    });
    if (!workshop || !workshop.isActive) {
      throw new NotFoundException('Workshop not found or inactive');
    }

    // 4. Create Maintenance & Update Vehicle Status
    const maintenance = this.maintenanceRepository.create({
      ...createDto,
      startDate: start,
      endDate: end,
    });

    const savedMaintenance = await this.maintenanceRepository.save(maintenance);

    // Update vehicle status to IN_MAINTENANCE
    vehicle.status = VehicleStatus.IN_MAINTENANCE;
    await this.vehicleRepository.save(vehicle);

    return savedMaintenance;
  }

  async findAll(): Promise<MaintenanceEntity[]> {
    return this.maintenanceRepository.find();
  }

  async findOne(id: string): Promise<MaintenanceEntity> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
    });
    if (!maintenance) {
      throw new NotFoundException('Maintenance record not found');
    }
    return maintenance;
  }

  async update(
    id: string,
    updateDto: UpdateMaintenanceDto,
  ): Promise<MaintenanceEntity> {
    const maintenance = await this.findOne(id);

    if (updateDto.status) {
      maintenance.status = updateDto.status;

      // If completed or cancelled, return vehicle to AVAILABLE status
      if (
        updateDto.status === MaintenanceStatus.COMPLETED ||
        updateDto.status === MaintenanceStatus.CANCELLED
      ) {
        const vehicle = await this.vehicleRepository.findOne({
          where: { id: maintenance.vehicleId },
        });
        if (vehicle) {
          vehicle.status = VehicleStatus.AVAILABLE;
          await this.vehicleRepository.save(vehicle);
        }
      }
    }

    Object.assign(maintenance, updateDto);
    return this.maintenanceRepository.save(maintenance);
  }
}
