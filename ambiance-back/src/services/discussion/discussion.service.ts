import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discussion } from '../../entities/discussions.entity';
import { Groupe } from '../../entities/groups.entity';
import { Participation } from '../../entities/participation.entity';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectRepository(Discussion)
    private discussionRepository: Repository<Discussion>,
    @InjectRepository(Groupe)
    private groupeRepository: Repository<Groupe>,
    @InjectRepository(Participation)
    private participationRepository: Repository<Participation>,
  ) {}

  async create(data: any): Promise<Discussion> {
    const groupe = await this.groupeRepository.findOneByOrFail({ idGroupe: data.idGroupe });
    const discussion = this.discussionRepository.create({
      typeDiscussion: data.typeDiscussion,
      idGroupe: groupe,
    });
    return this.discussionRepository.save(discussion);
  }

  findAll(): Promise<Discussion[]> {
    return this.discussionRepository.find({ relations: ['idGroupe'] });
  }

  async findOne(id: number): Promise<Discussion> {
    const discussion = await this.discussionRepository.findOne({
      where: { idDiscussion: id },
      relations: ['idGroupe'],
    });
    if (!discussion) {
      throw new NotFoundException(`Discussion ${id} non trouvée`);
    }
    return discussion;
  }

  async update(id: number, data: any): Promise<Discussion> {
    const discussion = await this.findOne(id);

    if (data.typeDiscussion !== undefined) {
      discussion.typeDiscussion = data.typeDiscussion;
    }

    if (data.idGroupe !== undefined) {
      const groupe = await this.groupeRepository.findOneByOrFail({ idGroupe: data.idGroupe });

      discussion.idGroupe = groupe;
    }

    return this.discussionRepository.save(discussion);
  }

  async remove(id: number): Promise<void> {
    const discussion = await this.findOne(id);
    await this.discussionRepository.remove(discussion);
  }



  async findGroupNamesAndDiscussionIdsByUser(userId: number): Promise<{ nomGroupe: string; idDiscussion: number }[]> {
    return this.discussionRepository
      .createQueryBuilder('discussion')
      .innerJoin('discussion.idGroupe', 'groupe') // Relation avec la table Groupes
      .innerJoin('groupe.participations', 'participation') // Relation avec la table Participation
      .where('participation.idUtilisateur = :userId', { userId }) // Filtrer par utilisateur
      .select([
        'groupe.NomDuGroupe AS nomGroupe', // Nom du groupe
        'discussion.idDiscussion AS idDiscussion', // ID de la discussion
      ])
      .getRawMany(); // Récupérer les résultats sous forme brute
  }
}