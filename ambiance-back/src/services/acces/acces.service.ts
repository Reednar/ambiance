import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Acces } from '../../entities/acces.entity';

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Acces)
    private readonly accesRepository: Repository<Acces>,
  ) {}

  async findAll(): Promise<Acces[]> {
    return await this.accesRepository.find();
  }

  async findOne(id: number): Promise<Acces> {
    return await this.accesRepository.findOneBy({ idAcces: id });
  }

  async create(post: Partial<Acces>): Promise<Acces> {
    const newAcces = this.accesRepository.create(post);
    return await this.accesRepository.save(newAcces);
  }

  async update(id: number, updateData: Partial<Acces>): Promise<Acces> {
    await this.accesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.accesRepository.delete(id);
  }
}
