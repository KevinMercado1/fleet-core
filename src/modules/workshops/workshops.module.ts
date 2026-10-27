import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkshopEntity } from './entities/workshop.entity.js';
import { WorkshopsService } from './workshops.service.js';
import { WorkshopsController } from './workshops.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([WorkshopEntity])],
  controllers: [WorkshopsController],
  providers: [WorkshopsService],
  exports: [WorkshopsService],
})
export class WorkshopsModule {}
