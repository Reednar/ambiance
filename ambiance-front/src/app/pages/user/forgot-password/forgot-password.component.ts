import { Component } from '@angular/core';
import { UsersService } from '../../../service/users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  // Adresse email saisie par l'utilisateur pour la réinitialisation du mot de passe
  email: string = '';

  // Message de succès à afficher (ex: "Email envoyé")
  message: string = '';

  // Message d'erreur à afficher en cas de problème lors de la requête
  error: string = '';

  // Injection du service UsersService pour appeler l'API liée aux utilisateurs
  constructor(private usersService: UsersService) { }

  /**
   * Méthode appelée lors de la soumission du formulaire
   */
  onSubmit() {
    // Réinitialisation des messages à chaque soumission
    this.message = '';
    this.error = '';

    // Appel du service pour lancer la procédure "mot de passe oublié" avec l'email fourni
    this.usersService.forgotPassword(this.email).subscribe({
      // En cas de succès, on affiche le message reçu (ex: instructions envoyées par email)
      next: (res: { message: string; }) => this.message = res.message,

      // En cas d'erreur, on affiche le message d'erreur retourné ou un message générique
      error: (err: { error: { message: string; }; }) => this.error = err.error?.message || 'Erreur lors de l’envoi de l’email'
    });
  }
}
