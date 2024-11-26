import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../../entities/images.entity';

@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image)
        private readonly groupeRepository: Repository<Image>,
      ) {}
    
      async findAll(): Promise<Image[]> {
        return await this.groupeRepository.find();
      }
    
      async findOne(id: number): Promise<Image> {
        return await this.groupeRepository.findOneBy({ idImage: id });
      }
    
      async create(Groupe: Partial<Image>): Promise<Image> {
        const newUser = this.groupeRepository.create(Groupe);
        return await this.groupeRepository.save(newUser);
      }
    
      async update(id: number, updateData: Partial<Image>): Promise<Image> {
        await this.groupeRepository.update(id, updateData);
        return this.findOne(id);
      }
    
      async remove(id: number): Promise<void> {
        await this.groupeRepository.delete(id);
      }
}
