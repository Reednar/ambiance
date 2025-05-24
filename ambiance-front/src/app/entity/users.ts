//  objet User
export interface User {
    idUtilisateur: number;
    prenom: string;
    nom: string;
    pseudo: string;
    dateDeNaissance: string;
    genre: string;
    mail: string;
    motDePasse: string;
    role: string;
    telephone: string;
    pays: string;
    image: string | null;  // base64 image
    emailConfirmed: boolean;
  }
  