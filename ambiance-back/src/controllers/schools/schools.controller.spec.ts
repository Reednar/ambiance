import { Test, TestingModule } from '@nestjs/testing';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from '../../services/schools/schools.service';
import { MembresBDEService } from '../../services/membresBDE/membresBDE.service';
import { NotFoundException } from '@nestjs/common';
import { School } from '../../entities/schools.entity';
import { User } from '../../entities/users.entity';
import { MembresBDE } from '../../entities/membresBDE.entity';

describe('SchoolsController', () => {
  let controller: SchoolsController;
  let schoolsService: SchoolsService;
  let membresBDEService: MembresBDEService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolsController],
      providers: [
        {
          provide: SchoolsService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: MembresBDEService,
          useValue: {
            addMember: jest.fn(),
            findPendingMembersBySchool: jest.fn(),
            findMemberBySchoolAndUser: jest.fn(),
            updateMemberStatus: jest.fn(),
            removeMember: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SchoolsController>(SchoolsController);
    schoolsService = module.get<SchoolsService>(SchoolsService);
    membresBDEService = module.get<MembresBDEService>(MembresBDEService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSchool', () => {
    it('should create a new school', async () => {
      const schoolData = {
        nom: 'Test School',
        ville: 'Paris',
        rue: '123 Rue',
        codePostal: '75000',
        site_web: 'https://example.com',
        telephone: '0123456789',
        description: 'A test school',
        contact_email: 'test@example.com',
        type_ecole: 'publique',
      } as School;

      const createdSchool = { id: 1, ...schoolData } as School;
      jest.spyOn(schoolsService, 'create').mockResolvedValue(createdSchool);

      const result = await controller.createSchool(schoolData, { method: 'POST', url: '/schools/create' } as any);
      expect(result).toEqual(createdSchool);
      expect(schoolsService.create).toHaveBeenCalledWith(schoolData);
    });
  });

  describe('findSchool', () => {
    it('should return a school by ID', async () => {
      const school = {
        id: 1,
        nom: 'Test School',
        site_web: 'https://example.com',
        telephone: '0123456789',
        description: 'A test school',
        contact_email: 'test@example.com',
        type_ecole: 'publique',
        rue: '123 Rue',
        ville: 'Paris',
        codePostal: '75000',
        createur: {} as User,
      } as School;

      jest.spyOn(schoolsService, 'findOne').mockResolvedValue(school);

      const result = await controller.findSchool({ id: 1 }, { method: 'POST', url: '/schools/find' } as any);
      expect(result).toEqual(school);
      expect(schoolsService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if school is not found', async () => {
      jest.spyOn(schoolsService, 'findOne').mockResolvedValue(null);

      await expect(controller.findSchool({ id: 1 }, { method: 'POST', url: '/schools/find' } as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addMemberToBDE', () => {
    it('should add a member to the BDE', async () => {
      const body = { idUtilisateur: 1, idEcole: 1, email: 'test@example.com' };
      const school = {
        id: 1,
        nom: 'Test School',
        createur: { idUtilisateur: 1, prenom: 'John', nom: 'Doe', pseudo: 'johndoe', dateDeNaissance: new Date(), genre: 'Homme', mail: 'john@example.com', motDePasse: 'hashedpassword', pays: 'France', role: 'Utilisateur', telephone: '0123456789' } as User,
      } as School;

      jest.spyOn(schoolsService, 'findOne').mockResolvedValue(school);
      jest.spyOn(membresBDEService, 'addMember').mockResolvedValue();

      await controller.addMemberToBDE(body, { method: 'POST', url: '/schools/addMember' } as any);
      expect(membresBDEService.addMember).toHaveBeenCalledWith({
        idUtilisateur: 1,
        idEcole: 1,
        email: 'test@example.com',
        status: 'pending',
      });
    });

    it('should throw NotFoundException if school is not found', async () => {
      jest.spyOn(schoolsService, 'findOne').mockResolvedValue(null);

      await expect(
        controller.addMemberToBDE({ idUtilisateur: 1, idEcole: 1, email: 'test@example.com' }, { method: 'POST', url: '/schools/addMember' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeMemberFromBDE', () => {
    it('should remove a member from the BDE', async () => {
      const body = { idEcole: 1, idCreateur: 1, idUtilisateur: 2 };
      const school = {
        id: 1,
        nom: 'Test School',
        createur: { idUtilisateur: 1, prenom: 'John', nom: 'Doe', pseudo: 'johndoe', dateDeNaissance: new Date(), genre: 'Homme', mail: 'john@example.com', motDePasse: 'hashedpassword', pays: 'France', role: 'Utilisateur', telephone: '0123456789' } as User,
      } as School;

      const member = {
        idEcole: 1,
        idUtilisateur: 2,
        status: 'pending',
        dateFin: null,
        isActif: true,
        utilisateur: {} as User,
        ecole: {} as School,
      } as MembresBDE;

      jest.spyOn(schoolsService, 'findOne').mockResolvedValue(school);
      jest.spyOn(membresBDEService, 'findMemberBySchoolAndUser').mockResolvedValue(member);
      jest.spyOn(membresBDEService, 'removeMember').mockResolvedValue();

      await controller.removeMemberFromBDE(body, { method: 'POST', url: '/schools/removeMember' } as any);
      expect(membresBDEService.removeMember).toHaveBeenCalledWith(1, 2);
    });

    it('should throw NotFoundException if member is not found', async () => {
      const school = {
        id: 1,
        nom: 'Test School',
        createur: { idUtilisateur: 1, prenom: 'John', nom: 'Doe', pseudo: 'johndoe', dateDeNaissance: new Date(), genre: 'Homme', mail: 'john@example.com', motDePasse: 'hashedpassword', pays: 'France', role: 'Utilisateur', telephone: '0123456789' } as User,
      } as School;

      jest.spyOn(schoolsService, 'findOne').mockResolvedValue(school);
      jest.spyOn(membresBDEService, 'findMemberBySchoolAndUser').mockResolvedValue(null);

      await expect(
        controller.removeMemberFromBDE({ idEcole: 1, idCreateur: 1, idUtilisateur: 2 }, { method: 'POST', url: '/schools/removeMember' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});



