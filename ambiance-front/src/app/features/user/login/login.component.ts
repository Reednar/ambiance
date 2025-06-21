import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/authent.service';
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

  twoFactorRequired = false;
  passwordVisible = false;

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
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      code: [''] // pas de Validators.required au départ
    });


    // Si l'utilisateur est déjà connecté, on le redirige immédiatement
    this.authService.isAuthenticated().subscribe(status => {
      if (status.authenticated) {
        this.router.navigate([this.redirectTo]);
      }
    });

  }

  /**
   * Méthode appelée lors de la soumission du formulaire de connexion
   */
  // onLoginSubmit(): void {
  //   if (this.loginForm.valid) {
  //     // Récupère les valeurs des champs mail et password
  //     const { mail, password } = this.loginForm.value;

  //     // Appelle la méthode de connexion du service AuthService
  //     this.authService.login({ mail, password }).subscribe(
  //       () => {
  //         this.loginFailed = false;
  //         this.messageService.add({ severity: 'success', summary: 'Connexion réussie', detail: 'Bienvenue !' });
  //         this.router.navigate([this.redirectTo]);
  //       },
  //       () => {
  //         this.loginFailed = true;
  //         this.messageService.add({ severity: 'error', summary: 'Échec de la connexion', detail: 'Email ou mot de passe incorrect.' });
  //       }
  //     );

  //   }
  //   // Note : si formulaire invalide, Angular affichera automatiquement les erreurs sur les champs grâce aux validations
  // }


  onLoginSubmit(): void {
  if (this.loginForm.valid) {
    const { mail, password, code } = this.loginForm.value;
    const payload: any = { mail, password };

    if (this.twoFactorRequired) {
      payload.code = code;
    }

    this.authService.login2FA(payload).subscribe(
      (res: any) => {
        if (res.twoFactorRequired) {
          this.twoFactorRequired = true;
          this.messageService.add({
            severity: 'info',
            summary: 'Code 2FA requis',
            detail: res.message || 'Un code a été envoyé par mail.',
          });
          this.loginForm.get('code')?.setValidators([Validators.required, Validators.minLength(6)]);
          this.loginForm.get('code')?.updateValueAndValidity();
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Connexion réussie',
            detail: 'Bienvenue !',
          });
          this.router.navigate([this.redirectTo]);
        }
      },
      (err: { error: { message: any; }; }) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur de connexion',
          detail: err.error?.message || 'Email, mot de passe ou code incorrect.',
        });
      }
    );
  }
}

onResend2FACode(): void {
    const { mail } = this.loginForm.value;
    this.authService.resend2FACode(mail).subscribe(() => {
      this.messageService.add({ severity: 'info', summary: 'Code renvoyé', detail: 'Un nouveau code 2FA a été envoyé par email.' });
    });
}

togglePasswordVisibility(): void {
  this.passwordVisible = !this.passwordVisible;
}
}
