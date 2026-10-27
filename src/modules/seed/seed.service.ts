import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
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

    // 1. Seed Users for each Role
    const usersToSeed = [
      {
        email: 'admin@fleetcore.com',
        password: 'Admin123*',
        role: UserRole.ADMIN,
      },
      {
        email: 'manager@fleetcore.com',
        password: 'Manager123*',
        role: UserRole.MANAGER,
      },
      {
        email: 'technician@fleetcore.com',
        password: 'Tech123*',
        role: UserRole.TECHNICIAN,
      },
    ];

    for (const u of usersToSeed) {
      const existing = await this.userRepository.findOne({
        where: { email: u.email },
      });
      if (!existing) {
        const hashedPassword = await argon2.hash(u.password);
        await this.userRepository.save(
          this.userRepository.create({
            email: u.email,
            password: hashedPassword,
            role: u.role,
          }),
        );
        this.logger.log(`Created user (${u.role}): ${u.email} / ${u.password}`);
      }
    }

    // 2. Seed Default Workshop
    const workshopName = 'Central Main Workshop';
    let workshop = await this.workshopRepository.findOne({
      where: { name: workshopName },
    });
    if (!workshop) {
      await this.workshopRepository.save(
        this.workshopRepository.create({
          name: workshopName,
          address: '100 Industrial Avenue, Sector 4',
          isActive: true,
        }),
      );
      this.logger.log('Default workshop created.');
    }

    // 3. Seed Default Mechanic
    const mechanicEmail = 'mechanic.john@fleetcore.com';
    let mechanic = await this.mechanicRepository.findOne({
      where: { email: mechanicEmail },
    });
    if (!mechanic) {
      await this.mechanicRepository.save(
        this.mechanicRepository.create({
          name: 'John Smith',
          email: mechanicEmail,
          specialization: MechanicSpecialization.ENGINE,
          isActive: true,
        }),
      );
      this.logger.log('Default mechanic created.');
    }

    // 4. Seed Default Vehicle
    const vehiclePlate = 'ABC-123';
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plate: vehiclePlate },
    });
    if (!existingVehicle) {
      await this.vehicleRepository.save(
        this.vehicleRepository.create({
          plate: vehiclePlate,
          brand: 'Freightliner',
          model: 'M2 106',
          year: 2023,
          mileage: 15500,
          status: VehicleStatus.AVAILABLE,
        }),
      );
      this.logger.log('Default vehicle created.');
    }

    this.logger.log('Database seeding process completed successfully.');
  }
}
