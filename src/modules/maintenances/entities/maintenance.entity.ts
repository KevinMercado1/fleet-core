import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VehicleEntity } from '../../vehiculos/entities/vehiculo.entity.js';
import { MechanicEntity } from '../../mecanicos/entities/mecanico.entity.js';
import { WorkshopEntity } from '../../workshops/entities/workshop.entity.js';

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('maintenances')
export class MaintenanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MaintenanceType,
  })
  type: MaintenanceType;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status: MaintenanceStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalCost: number;

  @Column({ type: 'int', nullable: true })
  finalMileage: number;

  @ManyToOne(() => VehicleEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: VehicleEntity;

  @Column()
  vehicleId: string;

  @ManyToOne(() => MechanicEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'mechanicId' })
  mechanic: MechanicEntity;

  @Column()
  mechanicId: string;

  @ManyToOne(() => WorkshopEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'workshopId' })
  workshop: WorkshopEntity;

  @Column()
  workshopId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
