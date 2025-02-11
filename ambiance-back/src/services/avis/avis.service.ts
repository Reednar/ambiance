import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avis } from '../../entities/avis.entity';

@Injectable()
export class AvisService {
  constructor(
    @InjectRepository(Avis)
    private readonly AvisRepository: Repository<Avis>,
  ) {}

  async findAll(): Promise<Avis[]> {
    return await this.AvisRepository.find();
  }

  async findOne(id: number): Promise<Avis> {
    return await this.AvisRepository.findOneBy({ idAvis: id });
  }

  async create(post: Partial<Avis>): Promise<Avis> {
    const newAvis = this.AvisRepository.create(post);
    return await this.AvisRepository.save(newAvis);
  }

  async update(id: number, updateData: Partial<Avis>): Promise<Avis> {
    await this.AvisRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.AvisRepository.delete(id);
  }
}
