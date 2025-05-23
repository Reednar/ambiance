//  Objet Publication
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
  idUtilisateur: string;
  utilisateur?: any;
  categories: { id: number; nom: string }[];
  publicationCategories?: PublicationCategorie[];
  image: string | null;  // base64 image
  imageMimeType: string | null;
  nombreParticipants: number;
  idGroupe: number;
  idParticipation : number;
  paiementEffectue : boolean;
}

//  Objet Categorie
export interface Categorie {
  idCategorie: number;
  nom: string;
  nombrePublications: number;
  publications: {
    id: number;
    nom: string;
  }[];
  publicationCategories?: {
    IdPublication: number;
    IdCategorie: number;
  }[];
}


//  Objet PublicationCategorie
export interface PublicationCategorie {
  IdPublication: number;
  IdCategorie: number;
  categorie: Categorie;
}