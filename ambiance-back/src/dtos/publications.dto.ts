import { PublicationCategories } from '../entities/publication-categories.entity';

export class PublicationDto {
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
  image: string | null; // data:image/jpeg;base64,...
  imageMimeType: string | null;
  idUtilisateur: number;
  categories: { id: number; nom: string }[];
  publicationCategories?: PublicationCategories[];
  nombreParticipants: number;
  idGroupe: number;
  idParticipation : number;
  paiementEffectue : boolean;
  dateFin: Date;
  idEcole: number;
  nomEcole: string;
  listeEcoleIds: string;
}
