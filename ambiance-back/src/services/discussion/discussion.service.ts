import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discussion } from '../../entities/discussions.entity';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectRepository(Discussion)
    private readonly discussionRepository: Repository<Discussion>,
  ) {}

  async createDiscussion(title: string, participants: number[]): Promise<Discussion> {
    const newDiscussion = this.discussionRepository.create({
      typeDiscussion: 1, // Exemple de type, ajustez selon vos besoins
      dateCreation: new Date(),
    });
    return await this.discussionRepository.save(newDiscussion);
  }

  async updateDiscussion(id: number, updateData: Partial<Discussion>): Promise<Discussion> {
    await this.discussionRepository.update(id, updateData);
    return await this.discussionRepository.findOneBy({ idDiscussion: id });
  }

  async deleteDiscussion(id: number): Promise<void> {
    await this.discussionRepository.delete(id);
  }

  async findDiscussionById(id: number): Promise<Discussion> {
    return await this.discussionRepository.findOneBy({ idDiscussion: id });
  }

  async findAllDiscussions(): Promise<Discussion[]> {
    return await this.discussionRepository.find();
  }
}