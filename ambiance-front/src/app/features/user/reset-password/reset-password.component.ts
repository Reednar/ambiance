import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  // Le token de réinitialisation récupéré depuis l'URL (paramètre query)
  token: string | null = null;

  // Le nouveau mot de passe saisi par l'utilisateur
  newPassword: string = '';

  // Message de succès affiché à l'utilisateur
  message: string = '';

  // Message d'erreur affiché à l'utilisateur
  error: string = '';

  constructor(
    private route: ActivatedRoute, // Pour accéder aux paramètres d'URL
    private http: HttpClient,      // Pour effectuer des requêtes HTTP (non utilisé directement ici)
    private router: Router,        // Pour la navigation entre routes
    private userService: UsersService  // Service métier gérant les utilisateurs
  ) { }

  /**
   * Méthode appelée automatiquement à l'initialisation du composant.
   * Récupère le token de réinitialisation dans les paramètres query de l'URL.
   * Si aucun token n'est trouvé, affiche une erreur.
   */
  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.error = 'Token manquant dans l’URL';
    }
  }

  /**
   * Méthode appelée lors de la soumission du formulaire.
   * Vérifie la présence du token, puis appelle le service pour réinitialiser le mot de passe.
   * Affiche un message de succès ou d'erreur selon la réponse.
   * En cas de succès, redirige vers la page de login après un délai.
   */
  onSubmit() {
    if (!this.token) return;  // Sécurité : ne fait rien si token absent

    // Réinitialisation des messages pour un nouveau feedback propre
    this.message = '';
    this.error = '';

    // Appel au service de réinitialisation du mot de passe
    this.userService.resetPassword(this.token, this.newPassword)
      .subscribe({
        next: res => {
          // Affiche le message de succès reçu du backend
          this.message = res.message;

          // Redirection vers la page de connexion après 2 secondes
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: err => {
          // Affiche le message d'erreur reçu ou un message générique
          this.error = err.error?.message || 'Erreur lors de la réinitialisation';
        }
      });
  }
}
