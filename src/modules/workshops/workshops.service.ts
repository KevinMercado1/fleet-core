import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkshopEntity } from './entities/workshop.entity.js';
import {
  CreateWorkshopDto,
  UpdateWorkshopDto,
} from './dto/create-workshop.dto.js';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(WorkshopEntity)
    private readonly workshopRepository: Repository<WorkshopEntity>,
  ) {}

  // Register a new workshop
  async create(createWorkshopDto: CreateWorkshopDto): Promise<WorkshopEntity> {
    const existing = await this.workshopRepository.findOne({
      where: { name: createWorkshopDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Workshop with name '${createWorkshopDto.name}' already exists`,
      );
    }

    const workshop = this.workshopRepository.create(createWorkshopDto);
    return this.workshopRepository.save(workshop);
  }

  // List all registered workshops
  async findAll(): Promise<WorkshopEntity[]> {
    return this.workshopRepository.find();
  }

  // Find a specific workshop by ID
  async findOne(id: string): Promise<WorkshopEntity> {
    const workshop = await this.workshopRepository.findOne({ where: { id } });
    if (!workshop) {
      throw new NotFoundException('Workshop not found');
    }
    return workshop;
  }

  // Update workshop details or toggle active status
  async update(
    id: string,
    updateWorkshopDto: UpdateWorkshopDto,
  ): Promise<WorkshopEntity> {
    const workshop = await this.findOne(id);

    if (updateWorkshopDto.name && updateWorkshopDto.name !== workshop.name) {
      const existing = await this.workshopRepository.findOne({
        where: { name: updateWorkshopDto.name },
      });
      if (existing) {
        throw new ConflictException(
          `Workshop with name '${updateWorkshopDto.name}' already exists`,
        );
      }
    }

    Object.assign(workshop, updateWorkshopDto);
    return this.workshopRepository.save(workshop);
  }
}
