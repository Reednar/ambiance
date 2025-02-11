import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { Document } from '../../entities/documents.entity'; // Assuming you have a Document entity
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DocumentsService', () => {
  let service: DocumentsService;

  const mockDocumentRepository = {
    findOne: jest.fn(),
    // Add other methods as needed
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
