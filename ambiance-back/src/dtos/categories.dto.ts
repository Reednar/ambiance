import { PublicationCategories } from '../entities/publication-categories.entity';

export class CategorieDto {
  idCategorie: number;
  nom: string;
  publications: { id: number; nom: string }[];
  publicationCategories?: PublicationCategories[];
  nombrePublications: number;
}
