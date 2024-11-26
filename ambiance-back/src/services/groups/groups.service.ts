import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groupe } from '../../entities/groups.entity';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Groupe)
        private readonly groupeRepository: Repository<Groupe>,
      ) {}
    
      async findAll(): Promise<Groupe[]> {
        return await this.groupeRepository.find();
      }
    
      async findOne(id: number): Promise<Groupe> {
        return await this.groupeRepository.findOneBy({ idGroupe: id });
      }
    
      async create(Groupe: Partial<Groupe>): Promise<Groupe> {
        const newUser = this.groupeRepository.create(Groupe);
        return await this.groupeRepository.save(newUser);
      }
    
      async update(id: number, updateData: Partial<Groupe>): Promise<Groupe> {
        await this.groupeRepository.update(id, updateData);
        return this.findOne(id);
      }
    
      async remove(id: number): Promise<void> {
        await this.groupeRepository.delete(id);
      }
}
