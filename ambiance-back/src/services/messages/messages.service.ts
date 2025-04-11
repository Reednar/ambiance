import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/messages.entity';
import { User } from '../../entities/users.entity'; // Import de l'entité User
import { Discussion } from '../../entities/discussions.entity'; // Import de l'entité Discussion

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Discussion)
    private readonly discussionRepository: Repository<Discussion>,
  ) {}

  async create(messageData: Partial<Message>): Promise<Message> {
    const message = this.messagesRepository.create(messageData);
    return await this.messagesRepository.save(message);
  }

  async findByDiscussion(discussionId: number): Promise<Message[]> {
    return await this.messagesRepository.find({
      where: { idDiscussion: { idDiscussion: discussionId } as Discussion },
      relations: ['idUtilisateur', 'idDiscussion'],
      order: { dateEnvoi: 'ASC' },
    });
  }

  async getUserById(userId: number): Promise<User | null> {
    return await this.messagesRepository.manager.findOne(User, { where: { idUtilisateur: userId } });
  }

  async getDiscussionById(discussionId: number): Promise<Discussion | null> {
    return await this.messagesRepository.manager.findOne(Discussion, { where: { idDiscussion: discussionId } });
  }

  async createDiscussion(title: string, participants: number[]): Promise<Discussion> {
    const newDiscussion = this.discussionRepository.create({
      typeDiscussion: 1, // Exemple de type
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