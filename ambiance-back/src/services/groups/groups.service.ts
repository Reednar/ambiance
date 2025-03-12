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
}
