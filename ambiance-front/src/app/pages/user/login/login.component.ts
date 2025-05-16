import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../service/authent.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  redirectTo: string = '/dashboard'; // Valeur par défaut si aucun redirect précisé

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute // pour lire les query params
  ) {}

  ngOnInit(): void {
    // Récupère l'URL où l'utilisateur voulait aller
    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/';

    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.redirectTo]);
    }
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const { mail, password } = this.loginForm.value;

      this.authService.login({ mail, password }).subscribe(
        (response) => {
          this.router.navigate([this.redirectTo]);
        },
        (error) => {
          // Gère les erreurs ici
          console.error('Erreur de connexion:', error);
        }
      );
    }
  }
}
