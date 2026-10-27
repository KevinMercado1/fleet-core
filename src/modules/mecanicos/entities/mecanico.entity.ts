import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MechanicSpecialization {
  ENGINE = 'ENGINE',
  TRANSMISSION = 'TRANSMISSION',
  ELECTRICAL = 'ELECTRICAL',
  GENERAL = 'GENERAL',
}

@Entity('mechanics')
export class MechanicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: MechanicSpecialization,
    default: MechanicSpecialization.GENERAL,
  })
  specialization: MechanicSpecialization;

  @Column({ default: true })
  isActive: boolean; // Logical activation/inactivation state

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
