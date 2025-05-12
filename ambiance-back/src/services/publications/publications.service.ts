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
    @InjectRepository(User) private readonly userRepository: Repository<User>, // Ajoute ce repository si tu en as besoin
  ) {}

  async findAll(): Promise<Publication[]> {
    return await this.publicationRepository.find({
      relations: ['publicationCategories', 'publicationCategories.categorie'],
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
  
  
}
