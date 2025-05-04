import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PublicationCategories } from './publication-categories.entity';

@Entity('Categories') // Correspond au nom de la table
export class Categorie {
  @PrimaryGeneratedColumn({ name: 'idCategorie' })
  idCategorie: number;

  @Column({ name: 'nom', type: 'varchar', length: 50 })
  nom: string;

  @OneToMany(() => PublicationCategories, pc => pc.categorie)
  publicationCategories: PublicationCategories[];

}
