import { Test, TestingModule } from '@nestjs/testing';
import { SchoolsService } from './schools.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { School } from '../../entities/schools.entity';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

describe('SchoolsService', () => {
  let service: SchoolsService;
  let schoolsRepo: jest.Mocked<Repository<School>>;
  let usersRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolsService,
        {
          provide: getRepositoryToken(School),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            }),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SchoolsService>(SchoolsService);
    schoolsRepo = module.get(getRepositoryToken(School));
    usersRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('splitAllowedDomain', () => {
    it('should split domains correctly', () => {
      const input = 'gmail.com; univ.fr ; ; test.org ';
      const result = service.splitAllowedDomain(input);
      expect(result).toEqual(['gmail.com', 'univ.fr', 'test.org']);
    });

    it('should return empty array if input is empty', () => {
      expect(service.splitAllowedDomain('')).toEqual([]);
    });

    it('should return empty array if input is undefined', () => {
      expect(service.splitAllowedDomain(undefined)).toEqual([]);
    });
  });
});
