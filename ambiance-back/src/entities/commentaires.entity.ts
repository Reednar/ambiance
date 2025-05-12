import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';
import { Publication } from './publications.entity';

@Entity('Commentaires') // Correspond au nom de la table
export class Commentaire {
  @PrimaryGeneratedColumn({ name: 'idCommentaire' })
  idCommentaire: number;

  @Column({ name: 'Message', type: 'varchar', length: 50 })
  contenu: string;


  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'idUtilisateur' })
  idUtilisateur: User;

  @ManyToOne(() => Publication, { nullable: false })
  @JoinColumn({ name: 'idPublication' })
  idPublication: Publication;
}
