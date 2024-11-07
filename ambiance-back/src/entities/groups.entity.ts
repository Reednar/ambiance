import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Post } from './posts.entity';  // Assurez-vous que le chemin est correct
  
  @Entity('Groupes')  // Correspond au nom de la table
  export class Groupe {
    @PrimaryGeneratedColumn({ name: 'IdGroupe' })
    idGroupe: number;
  
    @Column({ name: 'NomDuGroupe', type: 'varchar', length: 50, nullable: false })
    nomDuGroupe: string;
  
    @Column({ name: 'NombrePersonne', type: 'smallint', nullable: true })
    nombrePersonne: number;
  
    // Relation Many-to-One avec la table Publications (Post en TypeORM)
    @ManyToOne(() => Post, (post) => post, {
      onDelete: 'CASCADE',  // Optionnel : supprime les groupes si le post est supprimé
    })
    @JoinColumn({ name: 'IdPublication' })  // Clé étrangère dans cette table
    publication: Post;
  }