import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication } from '../../entities/publications.entity';
import { Participation } from 'src/entities/participation.entity';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private readonly publicationRepository: Repository<Publication>,
    @InjectRepository(Participation)
    private readonly participationRepository: Repository<Participation>,
  ) {}

  async findAll(): Promise<Publication[]> {
    return await this.publicationRepository.find();
  }

  async findOne(id: number): Promise<Publication> {
    return await this.publicationRepository.findOneBy({ idPublication: id });
  }

  async create(publication: Partial<Publication>): Promise<Publication> {
    const newPublication = this.publicationRepository.create(publication);
    return await this.publicationRepository.save(newPublication);
  }

  async update(id: number, updateData: Partial<Publication>): Promise<Publication> {
    await this.publicationRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.publicationRepository.delete(id);
  }

  async findByUser(utilisateurId: number): Promise<Publication[]> {
    return await this.publicationRepository.find({
      where: { utilisateurId },
    });
  }

  async findParticipationsByUser(utilisateurId: number): Promise<any[]> {
    const d = await this.participationRepository
      .createQueryBuilder('participation')
      .leftJoin('participation.idGroupe', 'groupe') // LEFT JOIN avec la table Groupes
      .leftJoin('groupe.publication', 'publication') // LEFT JOIN avec la table Publications
      .where('participation.idUtilisateur = :utilisateurId', { utilisateurId }) // Filtrer par IdUtilisateur
      .select([
        'publication.idPublication', // Sélectionner les colonnes nécessaires
        'publication.codePostal',
        'publication.rue',
        'publication.ville',
        'publication.titre',
        'publication.dateEvenement',
        'publication.description',
        'publication.prix',
        'publication.lien',
        'publication.dateCreation',
        'publication.participantMax',
        'publication.participantMin',
        'publication.typePost',
      ])
      .getRawMany(); // Récupérer les résultats
    return d
  }
}
