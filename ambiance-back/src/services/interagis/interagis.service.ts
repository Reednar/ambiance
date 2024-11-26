import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interagis } from '../../entities/interagis.entity';

@Injectable()
export class InteragisService {
  constructor(
    @InjectRepository(Interagis)
    private readonly InteragisRepository: Repository<Interagis>,
  ) {}

  async findAll(): Promise<Interagis[]> {
    return await this.InteragisRepository.find();
  }

  async findOne(id: number): Promise<Interagis> {
    return await this.InteragisRepository.findOneBy({ idInteragis: id });
  }

  async create(post: Partial<Interagis>): Promise<Interagis> {
    const newInteragis = this.InteragisRepository.create(post);
    return await this.InteragisRepository.save(newInteragis);
  }

  async update(id: number, updateData: Partial<Interagis>): Promise<Interagis> {
    await this.InteragisRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.InteragisRepository.delete(id);
  }
}
