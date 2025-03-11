import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './posts.entity';

@Entity('Groupes') // Correspond au nom de la table
export class Groupe {
  @PrimaryGeneratedColumn({ name: 'IdGroupe' })
  idGroupe: number;

  @Column({ name: 'NomDuGroupe', type: 'varchar', length: 50, nullable: false })
  nomDuGroupe: string;

  @Column({ name: 'NombrePersonne', type: 'smallint', nullable: true })
  nombrePersonne: number;

  @ManyToOne(() => Post, (post) => post, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'IdPublication' })
  publication: Post;
}
