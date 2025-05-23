import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Article } from './articles.entity';

@Entity('Tags')
export class Tag {
  @PrimaryGeneratedColumn()
  idTag: number;

  @Column({ length: 100, unique: true })
  nom: string;

  @ManyToMany(() => Article, article => article.tags)
  articles: Article[];
}