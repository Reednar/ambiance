import { Component, OnInit } from '@angular/core';
import { User } from '../../../core/models/users';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User = {
    idUtilisateur: 0,
    prenom: '',
    nom: '',
    pseudo: '',
    dateDeNaissance: '',
    genre: '',
    mail: '',
    motDePasse: '',
    role: '',
    telephone: '',
    pays: '',
    image: '',
    emailConfirmed: false,
  };

  previewImage: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  saveProfile(): void {
    const id = this.user.idUtilisateur;
    const formData = new FormData();
    formData.append('prenom', this.user.prenom);
    formData.append('nom', this.user.nom);
    formData.append('dateDeNaissance', this.user.dateDeNaissance);
    formData.append('telephone', this.user.telephone);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
      formData.append('imageMimeType', this.selectedFile.type);
    }
    this.usersService.updateUser(id, formData).subscribe({
      next: (data) => console.log('Profil mis à jour', data),
      error: (error) => console.error('Erreur de mise à jour', error),
    });
  }


  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/;
    return phoneRegex.test(phone);
  }


  loadUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usersService.getUserById(Number(sessionStorage.getItem('id_utilisateur')) || 0).subscribe({
        next: (data) => {
          this.user = data;
          resolve();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des écoles', err);
          resolve();
        }
      });
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string; // pour prévisualiser dans le HTML
      };
      reader.readAsDataURL(file);
    }
  }

}
