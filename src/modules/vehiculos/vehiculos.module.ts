import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './entities/vehiculo.entity.js';
import { VehiclesService } from './vehiculos.service.js';
import { VehiclesController } from './vehiculos.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity])],
  controllers: [VehiclesController],
  providers: [VehiclesService],
  exports: [VehiclesService],
})
export class VehiclesModule {}
