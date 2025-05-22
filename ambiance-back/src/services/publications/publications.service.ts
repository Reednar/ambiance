import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Publication } from '../../entities/publications.entity';
import { Participation } from 'src/entities/participation.entity';
import { Groupe } from 'src/entities/groups.entity';
import { User } from 'src/entities/users.entity';
@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication) private readonly publicationRepository: Repository<Publication>,
    @InjectRepository(Participation) private readonly participationRepository: Repository<Participation>,
    @InjectRepository(Groupe) private readonly groupeRepository: Repository<Groupe>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async findAll(): Promise<Publication[]> {
    return await this.publicationRepository.find({
      relations: ['publicationCategories', 'publicationCategories.categorie', 'ecole'],
    });
  }

  async findOne(id: number): Promise<Publication> {
    return await this.publicationRepository.findOne({
      where: { idPublication: id },
      relations: ['publicationCategories', 'publicationCategories.categorie'], // Charger les relations
    });
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

  // Méthode pour récupérer les publications d'un utilisateur
  async getPublicationsByUser(utilisateurId: number): Promise<Publication[]> {
    // Étape 1 : Récupérer toutes les participations de l'utilisateur
    const participations = await this.participationRepository
    .createQueryBuilder('participation')
    .leftJoinAndSelect('participation.idGroupe', 'groupe')
    .leftJoin('participation.idUtilisateur', 'user')
    .where('user.idUtilisateur = :utilisateurId', { utilisateurId })
    .getMany();
    // Étape 2 : Récupérer les id des groupes où l'utilisateur participe
    const groupeIds = participations.map(participation => participation.idGroupe.idGroupe);

    // Étape 3 : Trouver les publications des groupes où l'utilisateur participe
    if (groupeIds.length > 0) {
      const groupes = await this.groupeRepository.find({
        where: { idGroupe: In(groupeIds) },  // Utilise "In" pour chercher plusieurs IDs
        relations: ['publication'],  // Charger la publication associée à chaque groupe
      });

      // Récupérer les publications
      const publications = groupes.map(groupe => groupe.publication);
      return publications;
    } else {
      return []; // Aucun groupe trouvé
    }
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
        'publication.DateFinEvenement',
        'publication.participantMax',
        'publication.participantMin',
        'publication.typePost',
      ])
      .getRawMany(); // Récupérer les résultats
    return d
  }

  async findBySchool(idEcole: number): Promise<Publication[]> {
    return await this.publicationRepository.find({
      where: { ecole: { id: idEcole } }, // Utiliser 'id' pour correspondre à la clé primaire de l'entité School
      relations: ['ecole'], // Charger la relation avec l'école
    });
  }

async findAllWhereEcoleIdInListe(idEcole: number): Promise<Publication[]> {
  return this.publicationRepository
    .createQueryBuilder('publication')
    .leftJoinAndSelect('publication.ecole', 'ecole') 
    .where("publication.listeEcoleIds = :id", { id: `${idEcole}` })
    .orWhere("publication.listeEcoleIds LIKE :start", { start: `${idEcole};%` })
    .orWhere("publication.listeEcoleIds LIKE :middle", { middle: `%;${idEcole};%` })
    .orWhere("publication.listeEcoleIds LIKE :end", { end: `%;${idEcole}` })
    .getMany();
}


}
