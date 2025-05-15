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

  async findOneWithCreator(id: number): Promise<School> {
    return await this.schoolsRepository
      .createQueryBuilder('school')
      .leftJoinAndSelect('school.createur', 'createur') // Charger la relation 'createur'
      .where('school.id = :id', { id })
      .getOne();
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

  /**
   * Prend le champ allowed_domain (string séparé par des ";") et retourne un tableau de domaines.
   * @param allowedDomain Le champ allowed_domain de l'école (ex: "gmail.com;etu.univ.fr")
   * @returns string[]
   */
  splitAllowedDomain(allowedDomain: string): string[] {
    if (!allowedDomain) return [];
    return allowedDomain
      .split(';')
      .map(domain => domain.trim())
      .filter(domain => domain.length > 0);
  }
}