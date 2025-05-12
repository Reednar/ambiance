import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Groupe } from '../../entities/groups.entity';
import { User } from '../../entities/users.entity';
import { Participation } from '../../entities/participation.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Groupe)
    private readonly groupeRepository: Repository<Groupe>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
  ) {}

  async findAll(): Promise<Groupe[]> {
    return await this.groupeRepository.find();
  }

  async findOne(id: number): Promise<Groupe> {
    return await this.groupeRepository.findOneBy({ idGroupe: id });
  }

  async create(Groupe: Partial<Groupe>): Promise<Groupe> {
    const newUser = this.groupeRepository.create(Groupe);
    return await this.groupeRepository.save(newUser);
  }

  async update(id: number, updateData: Partial<Groupe>): Promise<Groupe> {
    await this.groupeRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.groupeRepository.delete(id);
  }

  async addUserToGroup(idGroupe: number, idUtilisateur: number): Promise<Participation> {
    const groupe = await this.groupeRepository.findOneBy({ idGroupe });
    const utilisateur = await this.userRepository.findOneBy({ idUtilisateur });

    if (!groupe || !utilisateur) {
      throw new Error('Groupe or Utilisateur not found');
    }

    const participation = new Participation();
    participation.idGroupe = groupe;
    participation.idUtilisateur = utilisateur;
    participation.organisateur = true;
    participation.idPaiement = null; // Set IdPaiement to null if not applicable
    return await this.participationRepository.save(participation);
  }

  async addParticipation(participation: Partial<Participation>): Promise<Participation> {
    const groupe = await this.groupeRepository.findOneBy({ idGroupe: participation.idGroupe.idGroupe });
    const utilisateur = await this.userRepository.findOneBy({ idUtilisateur: participation.idUtilisateur.idUtilisateur });

    if (!groupe || !utilisateur) {
      throw new Error('Groupe or Utilisateur not found');
    }

    const newParticipation = new Participation();
    newParticipation.idGroupe = groupe;
    newParticipation.idUtilisateur = utilisateur;
    newParticipation.organisateur = participation.organisateur;
    newParticipation.idPaiement = participation.idPaiement;
    return await this.participationRepository.save(newParticipation);
  }

  async removeUserFromGroup(idGroupe: number, idUtilisateur: number): Promise<void> {
    const participation = await this.participationRepository
      .createQueryBuilder('participation')
      .where('participation.idGroupe = :idGroupe', { idGroupe })
      .andWhere('participation.idUtilisateur = :idUtilisateur', { idUtilisateur })
      .getOne();
    if (!participation) {
      throw new Error('Participation not found');
    }

    await this.participationRepository.delete({ idParticipation: participation.idParticipation });
  }

  async changeOrganisateur(idGroupe: number, idUtilisateur: number): Promise<void> {
    const groupe = await this.groupeRepository.findOneBy({ idGroupe });
    const utilisateur = await this.userRepository.findOneBy({ idUtilisateur });

    if (!groupe || !utilisateur) {
      throw new Error('Groupe or Utilisateur not found');
    }

    const currentOrganisateur = await this.participationRepository
      .createQueryBuilder('participation')
      .where('participation.idGroupe = :idGroupe', { idGroupe })
      .andWhere('participation.organisateur = :organisateur', { organisateur: true })
      .getOne();

    if (currentOrganisateur) {
      currentOrganisateur.organisateur = false;
      await this.participationRepository.save(currentOrganisateur);
    }

    const newOrganisateur = await this.participationRepository
      .createQueryBuilder('participation')
      .where('participation.idGroupe = :idGroupe', { idGroupe })
      .andWhere('participation.idUtilisateur = :idUtilisateur', { idUtilisateur })
      .getOne();

    if (newOrganisateur) {
      newOrganisateur.organisateur = true;
      await this.participationRepository.save(newOrganisateur);
    } else {
      throw new Error('New organisateur not found');
    }
  }

  async findGroupsByUser(IdUtilisateur: number): Promise<Groupe[]> {
    return await this.groupeRepository
      .createQueryBuilder('groupe')
      .innerJoin('Participation', 'participation', 'participation.idGroupe = groupe.idGroupe')
      .where('participation.idUtilisateur = :IdUtilisateur', { IdUtilisateur })
      .getMany();
  }

  async findUsersByGroup(IdGroupe: number): Promise<{ nom: string; prenom: string; pseudo: string }[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select(['user.nom', 'user.prenom', 'user.pseudo'])
      .innerJoin('Participation', 'participation', 'participation.idUtilisateur = user.idUtilisateur')
      .where('participation.idGroupe = :IdGroupe', { IdGroupe })
      .getRawMany();
  }

  async isOrganisateur(IdGroupe: number, senderId: number): Promise<boolean> {
    const participation = await this.participationRepository
      .createQueryBuilder('participation')
      .where('participation.idGroupe = :IdGroupe', { IdGroupe })
      .andWhere('participation.idUtilisateur = :senderId', { senderId })
      .andWhere('participation.organisateur = :organisateur', { organisateur: true })
      .getOne();

    return !!participation; // Retourne true si une participation avec le rôle d'organisateur est trouvée, sinon false
  }

  // async getGroupeByPublicationId(publicationId: number) {
  //   return this.groupeRepository.findOne({
  //     where: {
  //       publication: { idPublication: publicationId },
  //     },
  //     relations: ['participations', 'participations.idUtilisateur'],
  //   });
  // }
  async getGroupeByPublicationId(publicationId: number) {
    return this.groupeRepository
      .createQueryBuilder('groupe')
      .leftJoinAndSelect('groupe.participations', 'participation')
      .leftJoinAndSelect('participation.idUtilisateur', 'user') // Assurez-vous que l'utilisateur est bien chargé
      .where('groupe.idPublication = :publicationId', { publicationId })
      .getOne();
  }
  
  
}
