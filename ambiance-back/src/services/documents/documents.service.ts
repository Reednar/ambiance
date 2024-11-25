import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../entities/documents.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly postRepository: Repository<Document>,
  ) {}

  async findAll(): Promise<Document[]> {
    return await this.postRepository.find();
  }

  async findOne(id: number): Promise<Document> {
    return await this.postRepository.findOneBy({ idDocument: id });
  }

  async create(post: Partial<Document>): Promise<Document> {
    const newDocument = this.postRepository.create(post);
    return await this.postRepository.save(newDocument);
  }

  async update(id: number, updateData: Partial<Document>): Promise<Document> {
    await this.postRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}
