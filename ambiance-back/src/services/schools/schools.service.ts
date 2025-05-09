import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../../entities/schools.entity';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolsRepository: Repository<School>,
  ) {}

  async create(data: Partial<School>): Promise<School> {
    const school = this.schoolsRepository.create(data);
    return await this.schoolsRepository.save(school);
  }

  async findOne(id: number): Promise<School> {
    return await this.schoolsRepository.findOneBy({ id });
  }

  async findAll(): Promise<School[]> {
    return await this.schoolsRepository.find();
  }

  async update(id: number, data: Partial<School>): Promise<School> {
    await this.schoolsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.schoolsRepository.delete(id);
  }
}