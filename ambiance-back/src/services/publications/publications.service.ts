import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from '../../entities/publications.entity';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
  ) {}

  async findAll(): Promise<Publication[]> {
    return await this.publicationRepository.find();
  }

  async findOne(id: number): Promise<Publication> {
    return await this.publicationRepository.findOneBy({ idPublication: id });
  }

  async create(publication: Partial<Publication>): Promise<Publication> {
    const newPublication = this.publicationRepository.create(publication);
    return await this.publicationRepository.save(newPublication);
  }

  async update(id: number, updateData: Partial<Publication>): Promise<Publication> {
    await this.publicationRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.publicationRepository.delete(id);
  }
}
