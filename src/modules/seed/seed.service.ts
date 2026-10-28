import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity, UserRole } from '../users/entities/user.entity.js';
import {
  VehicleEntity,
  VehicleStatus,
} from '../vehiculos/entities/vehiculo.entity.js';
import {
  MechanicEntity,
  MechanicSpecialization,
} from '../mecanicos/entities/mecanico.entity.js';
import { WorkshopEntity } from '../workshops/entities/workshop.entity.js';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
    @InjectRepository(MechanicEntity)
    private readonly mechanicRepository: Repository<MechanicEntity>,
    @InjectRepository(WorkshopEntity)
    private readonly workshopRepository: Repository<WorkshopEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedDatabase();
  }

  private async seedDatabase() {
    this.logger.log('Checking and seeding initial database data...');

    // 1. Seed Users (1 ADMIN, 2 TECHNICIANS)
    const usersToSeed = [
      {
        email: 'admin@fleetcore.com',
        password: 'password123',
        role: UserRole.ADMIN,
      },
      {
        email: 'tech1@fleetcore.com',
        password: 'password123',
        role: UserRole.TECHNICIAN,
      },
      {
        email: 'tech2@fleetcore.com',
        password: 'password123',
        role: UserRole.TECHNICIAN,
      },
    ];

    for (const u of usersToSeed) {
      const existing = await this.userRepository.findOne({
        where: { email: u.email },
      });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await this.userRepository.save(
          this.userRepository.create({
            email: u.email,
            password: hashedPassword,
            role: u.role,
          }),
        );
        this.logger.log(`Created user (${u.role}): ${u.email}`);
      }
    }

    // 2. Seed Workshops (1 Active, 1 Inactive)
    const workshopsToSeed = [
      {
        name: 'Central Main Workshop',
        address: '100 Industrial Avenue',
        isActive: true,
      },
      {
        name: 'Old North Garage',
        address: '404 Abandoned Road',
        isActive: false,
      },
    ];

    for (const w of workshopsToSeed) {
      const existing = await this.workshopRepository.findOne({
        where: { name: w.name },
      });
      if (!existing) {
        await this.workshopRepository.save(this.workshopRepository.create(w));
        this.logger.log(`Workshop created: ${w.name} (Active: ${w.isActive})`);
      }
    }

    // 3. Seed Mechanics (2 Active, 1 Inactive)
    const mechanicsToSeed = [
      {
        name: 'John Smith',
        email: 'john.smith@fleetcore.com',
        specialization: MechanicSpecialization.ENGINE,
        isActive: true,
      },
      {
        name: 'Laura Gomez',
        email: 'laura.gomez@fleetcore.com',
        specialization: MechanicSpecialization.TRANSMISSION,
        isActive: true,
      },
      {
        name: 'Carlos Perez',
        email: 'carlos.perez@fleetcore.com',
        specialization: MechanicSpecialization.ELECTRICAL,
        isActive: false,
      },
    ];

    for (const m of mechanicsToSeed) {
      const existing = await this.mechanicRepository.findOne({
        where: { email: m.email },
      });
      if (!existing) {
        await this.mechanicRepository.save(this.mechanicRepository.create(m));
        this.logger.log(`Mechanic created: ${m.name} (Active: ${m.isActive})`);
      }
    }

    // 4. Seed Vehicles (2 AVAILABLE, 1 IN_MAINTENANCE, 1 INACTIVE)
    const vehiclesToSeed = [
      {
        plate: 'ABC-123',
        brand: 'Chevrolet',
        model: 'NPR',
        year: 2022,
        mileage: 45000,
        status: VehicleStatus.AVAILABLE,
      },
      {
        plate: 'XYZ-789',
        brand: 'Freightliner',
        model: 'M2',
        year: 2023,
        mileage: 15500,
        status: VehicleStatus.AVAILABLE,
      },
      {
        plate: 'MNT-001',
        brand: 'Ford',
        model: 'Cargo',
        year: 2021,
        mileage: 60000,
        status: VehicleStatus.IN_MAINTENANCE,
      },
      {
        plate: 'INA-999',
        brand: 'Isuzu',
        model: 'NMR',
        year: 2018,
        mileage: 120000,
        status: VehicleStatus.INACTIVE,
      },
    ];

    for (const v of vehiclesToSeed) {
      const existing = await this.vehicleRepository.findOne({
        where: { plate: v.plate },
      });
      if (!existing) {
        await this.vehicleRepository.save(this.vehicleRepository.create(v));
        this.logger.log(`Vehicle created: ${v.plate} [Status: ${v.status}]`);
      }
    }

    this.logger.log('Database seeding process completed successfully.');
  }
}
