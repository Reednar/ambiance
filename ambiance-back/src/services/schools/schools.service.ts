import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../../entities/schools.entity';
import { User } from 'src/entities/users.entity';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private readonly schoolsRepository: Repository<School>,
    @InjectRepository(User)
  private readonly usersRepository: Repository<User>,
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


async findByUserId(userId: number): Promise<School | null> {
  const user = await this.usersRepository.findOne({
  where: { idUtilisateur: userId },
  relations: ['ecole']
});
  return user?.ecole || null;
}

/**
 * Trouve une école qui autorise un domaine d'email donné
 * @param emailDomain Le domaine de l'email (ex: "etu.univ.fr")
 * @returns Promise<School | null>
 */
async findByAllowedDomain(emailDomain: string): Promise<School | null> {
  const schools = await this.schoolsRepository.find();
  
  for (const school of schools) {
    if (school.allowed_domain) {
      const allowedDomains = this.splitAllowedDomain(school.allowed_domain);
      if (allowedDomains.includes(emailDomain)) {
        return school;
      }
    }
  }
  
  return null;
}

/**
 * Extrait le domaine d'une adresse email
 * @param email L'adresse email complète
 * @returns string Le domaine de l'email
 */
extractDomainFromEmail(email: string): string {
  return email.split('@')[1];
}

}