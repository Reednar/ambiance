import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './users.entity';
import { Tag } from './tag.entity';

@Entity('Articles')
export class Article {
  @PrimaryGeneratedColumn({ name: 'IdArticle' })
  IdArticle: number;

  @Column({ name: 'Titre', length: 255 })
  Titre: string;

  @Column({ name: 'Contenu', type: 'text' })
  Contenu: string;

  @CreateDateColumn({ name: 'DateCreation', type: 'datetime' })
  DateCreation: Date;

  @ManyToOne(() => User, user => user.articles)
  @JoinColumn({ name: 'IdAuteur' })
  utilisateur: User;

  @ManyToMany(() => Tag, tag => tag.articles, { cascade: true })
  @JoinTable({
    name: 'Article_Tags',
    joinColumn: {
      name: 'IdArticle',
      referencedColumnName: 'IdArticle',
    },
    inverseJoinColumn: {
      name: 'IdTag',
      referencedColumnName: 'IdTag',
    }
  })
  tags: Tag[];
}
