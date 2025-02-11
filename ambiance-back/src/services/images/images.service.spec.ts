import { Test, TestingModule } from '@nestjs/testing';
import { ImagesService } from './images.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Image } from '../../entities/images.entity';
import { Repository } from 'typeorm';

describe('ImagesService', () => {
  let service: ImagesService;
  let repository: Repository<Image>;

  const mockImageRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(), // Add this line
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        { provide: getRepositoryToken(Image), useValue: mockImageRepository },
      ],
    }).compile();

    service = module.get<ImagesService>(ImagesService);
    repository = module.get<Repository<Image>>(getRepositoryToken(Image));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all images', async () => {
    const result = [{ idImage: 1, lienImage: Buffer.from('image') }];
    mockImageRepository.find.mockResolvedValue(result);

    expect(await service.findAll()).toEqual(result);
  });

  it('should return one image by id', async () => {
    const result = { idImage: 1, lienImage: Buffer.from('image') };
    mockImageRepository.findOneBy.mockResolvedValue(result);

    expect(await service.findOne(1)).toEqual(result);
  });

  it('should create a new image', async () => {
    const newImage = { lienImage: Buffer.from('new image') };
    const result = { idImage: 1, ...newImage };
    mockImageRepository.create.mockReturnValue(newImage); 
    mockImageRepository.save.mockResolvedValue(result);

    expect(await service.create(newImage)).toEqual(result);
  });

  it('should update an image', async () => {
    const updateData = { lienImage: Buffer.from('updated image') };
    const result = { idImage: 1, ...updateData };
    mockImageRepository.update.mockResolvedValue(result);
    mockImageRepository.findOneBy.mockResolvedValue(result);

    expect(await service.update(1, updateData)).toEqual(result);
  });

  it('should delete an image', async () => {
    mockImageRepository.delete.mockResolvedValue({ affected: 1 });

    await service.remove(1);
    expect(mockImageRepository.delete).toHaveBeenCalledWith(1);
  });
});
