import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './users.entity';
import { Tag } from './tag.entity';
import { School } from './schools.entity';

@Entity('Articles')
export class Article {
  @PrimaryGeneratedColumn({ name: 'IdArticle' })
  idArticle: number;

  @Column({ name: 'Titre', length: 255 })
  titre: string;

  @Column({ name: 'Contenu', type: 'text' })
  contenu: string;

  @CreateDateColumn({ name: 'DateCreation', type: 'datetime' })
  dateCreation: Date;

  @ManyToOne(() => User, user => user.articles)
  @JoinColumn({ name: 'IdAuteur' })
  utilisateur: User;

  @ManyToOne(() => School, ecole => ecole.articles)
  @JoinColumn({ name: 'id_ecole' })
  ecole: School;

  @Column({ name: 'id_ecole', type: 'int', nullable: false })
  idEcole: number;
  
  @Column({ name: 'Image', type: 'varchar', length: 255, nullable: true })
  image: string;

  @ManyToMany(() => Tag, tag => tag.articles, { cascade: true })
  @JoinTable({
    name: 'Article_Tags',
    joinColumn: {
      name: 'idArticle',
      referencedColumnName: 'idArticle',
    },
    inverseJoinColumn: {
      name: 'idTag',
      referencedColumnName: 'idTag',
    }
  })
  tags: Tag[];
}
