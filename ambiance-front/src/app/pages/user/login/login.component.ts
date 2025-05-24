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
  loginForm!: FormGroup;
  redirectTo: string = '/';
  loginFailed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

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
          this.loginFailed = false;
          this.messageService.add({ severity: 'success', summary: 'Connexion réussie', detail: 'Bienvenue !' });
          this.router.navigate([this.redirectTo]);
        },
        (error) => {
          this.loginFailed = true;
          this.messageService.add({ severity: 'error', summary: 'Échec de la connexion', detail: 'Email ou mot de passe incorrect.' });
        }
      );
    }
  }
}
