import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/messages.entity';
import { User } from '../../entities/users.entity';
import { Discussion } from '../../entities/discussions.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Discussion)
    private discussionRepository: Repository<Discussion>,
  ) {}

  async create(data: any): Promise<Message> {
    const user = await this.userRepository.findOneByOrFail({ idUtilisateur: data.idUtilisateur });
    const discussion = await this.discussionRepository.findOneByOrFail({ idDiscussion: data.idDiscussion });

    const message = this.messageRepository.create({
      contenu: data.contenu,
      idUtilisateur: user,
      idDiscussion: discussion,
    });

    return this.messageRepository.save(message);
  }

  findAll(): Promise<Message[]> {
    return this.messageRepository.find({ relations: ['idUtilisateur', 'idDiscussion'] });
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { idMessage: id },
      relations: ['idUtilisateur', 'idDiscussion'],
    });
    if (!message) {
      throw new NotFoundException(`Message ${id} non trouvé`);
    }
    return message;
  }

  async update(id: number, data: any): Promise<Message> {
    const message = await this.findOne(id);

    if (data.contenu !== undefined) {
      message.contenu = data.contenu;
    }

    if (data.idUtilisateur !== undefined) {
      const user = await this.userRepository.findOneByOrFail({ idUtilisateur: data.idUtilisateur });
      message.idUtilisateur = user;
    }

    if (data.idDiscussion !== undefined) {
      const discussion = await this.discussionRepository.findOneByOrFail({ idDiscussion: data.idDiscussion });
      message.idDiscussion = discussion;
    }

    return this.messageRepository.save(message);
  }

  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    await this.messageRepository.remove(message);
  }
}
