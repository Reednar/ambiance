import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(nom: string): Promise<Tag> {
    let tag = await this.tagRepository.findOne({ where: { nom } });
    if (!tag) {
      tag = this.tagRepository.create({ nom });
      await this.tagRepository.save(tag);
    }
    return tag;
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findOne(idTag: number): Promise<Tag | null> {
    return this.tagRepository.findOne({ where: { idTag } });
  }

  async remove(idTag: number): Promise<void> {
    await this.tagRepository.delete(idTag);
  }
}