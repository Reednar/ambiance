import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../service/authent.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Injecte AuthService
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Vérifie si l'utilisateur est déjà connecté au rafraîchissement de la page
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']); // Redirige l'utilisateur vers le tableau de bord s'il est déjà connecté
    }
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const { mail, password } = this.loginForm.value;
      console.log(mail, password);
      // Appel au service d'authentification pour se connecter
      this.authService.login({ mail, password }).subscribe(
        (response) => {
          console.log('Connexion réussie', response);
          this.router.navigate(['/']); 
          //window.location.reload();
        },
        (error) => {
          console.error('Erreur de connexion', error);
        }
      );
    } else {
      console.log('Formulaire invalide');
    }
  }
}
