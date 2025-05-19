import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commentaire } from '../../entities/commentaires.entity';

@Injectable()
export class CommentairesService {
  constructor(
    @InjectRepository(Commentaire)
    private readonly commentairesRepository: Repository<Commentaire>,
  ) {}

  async findAll(): Promise<Commentaire[]> {
    return await this.commentairesRepository.find();
  }

  async findOne(id: number): Promise<Commentaire> {
    return await this.commentairesRepository.findOneBy({ idCommentaire: id });
  }

  async create(commentaire: Partial<Commentaire>): Promise<Commentaire> {
    const newCommentaire = this.commentairesRepository.create(commentaire);
    return await this.commentairesRepository.save(newCommentaire);
  }

  async update(id: number, updateData: Partial<Commentaire>): Promise<Commentaire> {
    await this.commentairesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.commentairesRepository.delete(id);
  }

  async findByPublication(postId: number): Promise<Commentaire[]> {
    return await this.commentairesRepository
      .createQueryBuilder('commentaire')
      .leftJoinAndSelect('commentaire.idUtilisateur', 'utilisateur') // Charger les informations sur l'utilisateur
      //.leftJoinAndSelect('commentaire.idPublication', 'publication') // Charger les informations sur la publication
      .where('commentaire.idPublication = :postId', { postId }) // Filtrer par l'ID de la publication
      .getMany();
  }
}
