import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../../entities/documents.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async findAll(): Promise<Document[]> {
    return await this.documentRepository.find();
  }

  async findOne(id: number): Promise<Document> {
    return await this.documentRepository.findOneBy({ idDocument: id });
  }

  async create(post: Partial<Document>): Promise<Document> {
    const newDocument = this.documentRepository.create(post);
    return await this.documentRepository.save(newDocument);
  }

  async update(id: number, updateData: Partial<Document>): Promise<Document> {
    await this.documentRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.documentRepository.delete(id);
  }
}
