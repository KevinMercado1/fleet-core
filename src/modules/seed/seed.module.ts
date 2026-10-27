import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service.js';
import { UserEntity } from '../users/entities/user.entity.js';
import { VehicleEntity } from '../vehiculos/entities/vehiculo.entity.js';
import { MechanicEntity } from '../mecanicos/entities/mecanico.entity.js';
import { WorkshopEntity } from '../workshops/entities/workshop.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      VehicleEntity,
      MechanicEntity,
      WorkshopEntity,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
