import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './users.entity';
import { Publication } from './publications.entity';

@Entity('Commentaire') // Correspond au nom de la table
export class Commentaire {
  @PrimaryGeneratedColumn({ name: 'idCommentaire' })
  idCommentaire: number;

  @Column({ name: 'contenu', type: 'varchar', length: 50 })
  contenu: string;

  @Column({ name: 'date_commentaire', type: 'datetime' })
  dateCommentaire: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'idUtilisateur' })
  idUtilisateur: User;

  @ManyToOne(() => Publication, { nullable: false })
  @JoinColumn({ name: 'idPublication' })
  idPublication: Publication;
}
