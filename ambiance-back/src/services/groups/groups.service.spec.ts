import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Groupe } from '../../entities/groups.entity';
import { Repository } from 'typeorm';

describe('GroupsService', () => {
  let service: GroupsService;
  let repository: Repository<Groupe>;

  const mockGroupeRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        { provide: getRepositoryToken(Groupe), useValue: mockGroupeRepository },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
    repository = module.get<Repository<Groupe>>(getRepositoryToken(Groupe));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
