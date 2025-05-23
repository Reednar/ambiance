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

  async create(Nom: string): Promise<Tag> {
    let tag = await this.tagRepository.findOne({ where: { Nom } });
    if (!tag) {
      tag = this.tagRepository.create({ Nom });
      await this.tagRepository.save(tag);
    }
    return tag;
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findOne(IdTag: number): Promise<Tag | null> {
    return this.tagRepository.findOne({ where: { IdTag } });
  }

  async remove(IdTag: number): Promise<void> {
    await this.tagRepository.delete(IdTag);
  }
}