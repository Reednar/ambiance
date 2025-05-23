import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Article } from './articles.entity';

@Entity('Tags')
export class Tag {
  @PrimaryGeneratedColumn()
  IdTag: number;

  @Column({ length: 100, unique: true })
  Nom: string;

  @ManyToMany(() => Article, article => article.tags)
  articles: Article[];
}