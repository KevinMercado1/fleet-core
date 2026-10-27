import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MechanicEntity } from './entities/mecanico.entity.js';
import {
  CreateMechanicDto,
  UpdateMechanicDto,
} from './dto/create-mecanico.dto.js';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectRepository(MechanicEntity)
    private readonly mechanicRepository: Repository<MechanicEntity>,
  ) {}

  // Register a new mechanic
  async create(createMechanicDto: CreateMechanicDto): Promise<MechanicEntity> {
    const existing = await this.mechanicRepository.findOne({
      where: { email: createMechanicDto.email },
    });
    if (existing) {
      throw new ConflictException(
        `Mechanic with email ${createMechanicDto.email} already exists`,
      );
    }

    const mechanic = this.mechanicRepository.create(createMechanicDto);
    return this.mechanicRepository.save(mechanic);
  }

  // List all registered mechanics
  async findAll(): Promise<MechanicEntity[]> {
    return this.mechanicRepository.find();
  }

  // Find a specific mechanic by ID
  async findOne(id: string): Promise<MechanicEntity> {
    const mechanic = await this.mechanicRepository.findOne({ where: { id } });
    if (!mechanic) {
      throw new NotFoundException('Mechanic not found');
    }
    return mechanic;
  }

  // Update mechanic details or active status (inactivation preserves history)
  async update(
    id: string,
    updateMechanicDto: UpdateMechanicDto,
  ): Promise<MechanicEntity> {
    const mechanic = await this.findOne(id);

    if (updateMechanicDto.email && updateMechanicDto.email !== mechanic.email) {
      const existing = await this.mechanicRepository.findOne({
        where: { email: updateMechanicDto.email },
      });
      if (existing) {
        throw new ConflictException(
          `Mechanic with email ${updateMechanicDto.email} already exists`,
        );
      }
    }

    Object.assign(mechanic, updateMechanicDto);
    return this.mechanicRepository.save(mechanic);
  }
}
