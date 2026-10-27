import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceEntity } from './entities/maintenance.entity.js';
import { MaintenancesService } from './maintenances.service.js';
import { MaintenancesController } from './maintenances.controller.js';
import { VehicleEntity } from '../vehiculos/entities/vehiculo.entity.js';
import { MechanicEntity } from '../mecanicos/entities/mecanico.entity.js';
import { WorkshopEntity } from '../workshops/entities/workshop.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceEntity,
      VehicleEntity,
      MechanicEntity,
      WorkshopEntity,
    ]),
  ],
  controllers: [MaintenancesController],
  providers: [MaintenancesService],
  exports: [MaintenancesService],
})
export class MaintenancesModule {}
