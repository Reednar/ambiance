import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participation } from '../../entities/participation.entity';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(Participation)
    private readonly ParticipationRepository: Repository<Participation>,
  ) {}

  async findAll(): Promise<Participation[]> {
    return await this.ParticipationRepository.find();
  }

  async findOne(id: number): Promise<Participation> {
    return await this.ParticipationRepository.findOneBy({ idParticipation: id });
  }

  async create(post: Partial<Participation>): Promise<Participation> {
    const newInteragis = this.ParticipationRepository.create(post);
    return await this.ParticipationRepository.save(newInteragis);
  }

  async update(id: number, updateData: Partial<Participation>): Promise<Participation> {
    await this.ParticipationRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ParticipationRepository.delete(id);
  }
}
