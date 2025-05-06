import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Publication } from './publications.entity';
import { Categorie } from './categories.entity';

@Entity('Publication_Categories')
export class PublicationCategories {
  @PrimaryColumn({ name: 'IdPublication' })
  IdPublication: number;

  @PrimaryColumn({ name: 'IdCategorie' })
  IdCategorie: number;

  @ManyToOne(() => Publication, publication => publication.publicationCategories, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'IdPublication' })
  publication: Publication;

  @ManyToOne(() => Categorie, categorie => categorie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'IdCategorie' })
  categorie: Categorie;
}
