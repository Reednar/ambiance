import { Ecole } from "./ecole";

export interface Article {
  idArticle?: any;
  id: number;
  titre?: string;
  contenu: string;
  dateCreation: Date;
  idAuteur?: number;
  tags?: Tags[];
  image?: string;
  nomEcole: string;
  ecole?: Ecole;
  idEcole?: number;
}

export interface Tags {
  idTag: number;
  nom: string;
}