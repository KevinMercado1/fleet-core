import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, In } from 'typeorm';
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

    const vehicle = await this.vehicleRepository.findOne({
      where: { id: createDto.vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    if (vehicle.status === VehicleStatus.INACTIVE) {
      throw new BadRequestException(
        'Cannot assign maintenance to an INACTIVE vehicle',
      );
    }

    const mechanic = await this.mechanicRepository.findOne({
      where: { id: createDto.mechanicId },
    });
    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }
    if (!mechanic.isActive) {
      throw new BadRequestException(
        'Cannot assign maintenance to an inactive mechanic',
      );
    }

    const overlapping = await this.maintenanceRepository.findOne({
      where: {
        mechanicId: createDto.mechanicId,
        status: In([
          MaintenanceStatus.SCHEDULED,
          MaintenanceStatus.IN_PROGRESS,
        ]),
        startDate: LessThanOrEqual(end),
        endDate: MoreThanOrEqual(start),
      },
    });

    if (overlapping) {
      throw new ConflictException(
        'Mechanic schedule conflict: overlaps with another active maintenance.',
      );
    }

    const workshop = await this.workshopRepository.findOne({
      where: { id: createDto.workshopId },
    });
    if (!workshop) {
      throw new NotFoundException('Workshop not found');
    }
    if (!workshop.isActive) {
      throw new BadRequestException(
        'Cannot assign maintenance to an inactive workshop',
      );
    }

    const maintenance = this.maintenanceRepository.create({
      ...createDto,
      startDate: start,
    });

    return this.maintenanceRepository.save(maintenance);
  }

  async findAll(): Promise<MaintenanceEntity[]> {
    return this.maintenanceRepository.find({
      relations: { vehicle: true, mechanic: true, workshop: true },
    });
  }

  async findOne(id: string): Promise<MaintenanceEntity> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
      relations: { vehicle: true, mechanic: true, workshop: true },
    });
    if (!maintenance) {
      throw new NotFoundException('Maintenance record not found');
    }
    return maintenance;
  }

  async update(
    id: string,
    updateDto: UpdateMaintenanceDto & {
      finalCost?: number;
      finalMileage?: number;
    },
  ): Promise<MaintenanceEntity> {
    const maintenance = await this.findOne(id);

    if (maintenance.status === MaintenanceStatus.COMPLETED) {
      throw new BadRequestException(
        'Cannot modify a completed maintenance record.',
      );
    }

    if (updateDto.status) {
      const vehicle = await this.vehicleRepository.findOne({
        where: { id: maintenance.vehicleId },
      });

      if (updateDto.status === MaintenanceStatus.IN_PROGRESS && vehicle) {
        vehicle.status = VehicleStatus.IN_MAINTENANCE;
        await this.vehicleRepository.save(vehicle);
      }

      if (updateDto.status === MaintenanceStatus.COMPLETED) {
        if (
          !updateDto.finalCost ||
          !updateDto.finalMileage ||
          !updateDto.description
        ) {
          throw new BadRequestException(
            'Mandatory closure data missing: description, finalCost, and finalMileage are required to complete maintenance.',
          );
        }

        if (vehicle) {
          if (updateDto.finalMileage < vehicle.mileage) {
            throw new BadRequestException(
              'Final mileage cannot be lower than the current vehicle mileage.',
            );
          }
          vehicle.mileage = updateDto.finalMileage;
          vehicle.status = VehicleStatus.AVAILABLE;
          await this.vehicleRepository.save(vehicle);
        }
      }

      if (updateDto.status === MaintenanceStatus.CANCELLED && vehicle) {
        vehicle.status = VehicleStatus.AVAILABLE;
        await this.vehicleRepository.save(vehicle);
      }
    }

    Object.assign(maintenance, updateDto);
    if (updateDto.startDate)
      maintenance.startDate = new Date(updateDto.startDate);
    if (updateDto.endDate) maintenance.endDate = new Date(updateDto.endDate);

    return this.maintenanceRepository.save(maintenance);
  }
}
