export interface Publication {
  idPublication: number;
  codePostal: string;
  rue: string;
  ville: string;
  titre: string;
  dateEvenement: Date;
  description: string;
  prix: number;
  lien: string;
  dateCreation: Date;
  participantMax: number;
  participantMin: number;
  typePost: 'Evenement' | 'activité';
  placeHandicape: boolean;
  rampe: boolean;
  ascenseur: boolean;
  utilisateurId: number;
  utilisateur?: any; // Optionnel : tu peux le typer plus précisément
  categories: { id: number; nom: string }[]; // Id + nom pour affichage
  publicationCategories?: PublicationCategorie[];
  // image: Blob;
  // ImageMimeType?: string;
  image: string | null;  // base64 image
  imageMimeType: string | null;
}

export interface Categorie {
  idCategorie: number;
  nom: string;
}

export interface PublicationCategorie {
  IdPublication: number;
  IdCategorie: number;
  categorie: Categorie;
}