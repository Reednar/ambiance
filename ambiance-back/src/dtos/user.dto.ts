export class UserDto {
  idUtilisateur: number;
  prenom: string;
  nom: string;
  pseudo: string;
  dateDeNaissance: Date;
  genre: string;
  mail: string;
  role: string;
  telephone: string;
  pays: string;
  image: string | null; // base64 format
  imageMimeType: string | null;
}

export class UpdateUserDto {
  prenom?: string;
  nom?: string;
  pseudo?: string;
  dateDeNaissance?: Date;
  genre?: 'Homme' | 'Femme' | 'Autre';
  mail?: string;
  telephone?: string;
  pays?: string;
  image?: string; // base64
  imageMimeType?: string;
  emailConfirmed?: boolean;
  confirmationToken?: string | null;
  confirmationTokenExpires?: Date | null;
  motDePasse?: string;
  role?: string;
}
