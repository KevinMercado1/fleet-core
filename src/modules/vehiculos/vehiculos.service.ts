import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from './entities/vehiculo.entity.js';
import { CreateVehicleDto } from './dto/create-vehiculo.dto.js';
import { UpdateVehicleDto } from './dto/update-vehiculo.dto.js';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
  ) {}

  // Register a new vehicle ensuring unique plate constraint
  async create(createVehicleDto: CreateVehicleDto): Promise<VehicleEntity> {
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plate: createVehicleDto.plate },
    });

    if (existingVehicle) {
      throw new ConflictException(
        `Vehicle with plate ${createVehicleDto.plate} already exists`,
      );
    }

    const vehicle = this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }

  // List all registered vehicles
  async findAll(): Promise<VehicleEntity[]> {
    return this.vehicleRepository.find();
  }

  // Find a specific vehicle by ID
  async findOne(id: string): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  // Update vehicle information or status
  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<VehicleEntity> {
    const vehicle = await this.findOne(id);

    // If plate is being updated, verify uniqueness
    if (updateVehicleDto.plate && updateVehicleDto.plate !== vehicle.plate) {
      const existingVehicle = await this.vehicleRepository.findOne({
        where: { plate: updateVehicleDto.plate },
      });
      if (existingVehicle) {
        throw new ConflictException(
          `Vehicle with plate ${updateVehicleDto.plate} already exists`,
        );
      }
    }

    Object.assign(vehicle, updateVehicleDto);
    return this.vehicleRepository.save(vehicle);
  }
}
