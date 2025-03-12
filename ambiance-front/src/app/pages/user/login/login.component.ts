import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Connexion réussie', this.loginForm.value);
      // Ici, ajoute l'appel à ton service d'authentification
    } else {
      console.log('Formulaire invalide');
    }
  }
}