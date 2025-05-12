import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../service/authent.service';
import { UsersService } from '../../../service/users.service';
import { Router } from '@angular/router';
import { User } from '../../../entity/users';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  reglement: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Injecter le service AuthService
    private userService: UsersService, // Injecter le service AuthService
    private router: Router // Injecter le router si tu veux rediriger après l'inscription
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        //acceptTerms: [false, Validators.requiredTrue], // Ajout pour accepter les termes
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Créer un utilisateur avec les données du formulaire
      const user: Partial<User> = {
        prenom: this.registerForm.value.username,
        nom: this.registerForm.value.username,
        mail: this.registerForm.value.email,
        motDePasse: this.registerForm.value.password
      };
  
      // Appeler la méthode createUser du service
      this.userService.createUser(user).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erreur lors de la création de l\'utilisateur', error);
        }
      });
  
    } else {
    }
  }
  
  

  loginWithGoogle(): void {
  }
}