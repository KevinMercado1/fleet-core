import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MechanicEntity } from './entities/mecanico.entity.js';
import { MechanicsService } from './mecanicos.service.js';
import { MechanicsController } from './mecanicos.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([MechanicEntity])],
  controllers: [MechanicsController],
  providers: [MechanicsService],
  exports: [MechanicsService],
})
export class MechanicsModule {}
