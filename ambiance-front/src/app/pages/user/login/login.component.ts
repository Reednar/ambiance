import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../service/authent.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // Formulaire réactif pour la connexion
  loginForm!: FormGroup;

  // URL vers laquelle rediriger après connexion (par défaut racine)
  redirectTo: string = '/';

  // Indicateur pour afficher un message d'erreur en cas d'échec de connexion
  loginFailed: boolean = false;

  constructor(
    private fb: FormBuilder,         // Pour construire le formulaire
    private authService: AuthService, // Service d'authentification
    private router: Router,          // Pour naviguer entre pages
    private route: ActivatedRoute,   // Pour accéder aux paramètres de la route
    private messageService: MessageService // Service pour afficher des messages utilisateur (PrimeNG)
  ) { }

  /**
   * Initialisation du composant
   */
  ngOnInit(): void {
    // Récupère le paramètre "redirectTo" dans l'URL, si présent, sinon '/' (page d'accueil)
    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/';

    // Initialisation du formulaire avec deux champs : mail et mot de passe avec validations
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]], // email requis et valide
      password: ['', [Validators.required, Validators.minLength(6)]] // mot de passe requis, au moins 6 caractères
    });

    // Si l'utilisateur est déjà connecté, on le redirige immédiatement
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.redirectTo]);
    }
  }

  /**
   * Méthode appelée lors de la soumission du formulaire de connexion
   */
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      // Récupère les valeurs des champs mail et password
      const { mail, password } = this.loginForm.value;

      // Appelle la méthode de connexion du service AuthService
      this.authService.login({ mail, password }).subscribe(
        (response) => {
          // En cas de succès
          this.loginFailed = false; // reset erreur
          // Affiche un message de succès à l'utilisateur
          this.messageService.add({ severity: 'success', summary: 'Connexion réussie', detail: 'Bienvenue !' });
          // Redirige vers la page souhaitée
          this.router.navigate([this.redirectTo]);
        },
        (error) => {
          // En cas d'échec (ex : mauvais mail ou mot de passe)
          this.loginFailed = true;
          // Affiche un message d'erreur à l'utilisateur
          this.messageService.add({ severity: 'error', summary: 'Échec de la connexion', detail: 'Email ou mot de passe incorrect.' });
        }
      );
    }
    // Note : si formulaire invalide, Angular affichera automatiquement les erreurs sur les champs grâce aux validations
  }
}
