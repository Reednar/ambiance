import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../service/authent.service';
import { UsersService } from '../../../service/users.service';
import { Router } from '@angular/router';
import { User } from '../../../entity/users';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  countries = ['France', 'Belgique', 'Suisse', 'Canada', 'États-Unis', 'Autre'];
  maxDate = new Date().toISOString().split('T')[0]; // Date max = aujourd'hui

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UsersService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        reglement: [false, Validators.requiredTrue],
        genre: ['', Validators.required],
        dateDeNaissance: ['', [Validators.required, this.ageValidator(13)]],
        pays: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Validator personnalisé pour vérifier la correspondance des mots de passe
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Validator personnalisé pour l'âge minimum
  ageValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthDate = new Date(control.value);
      if (!control.value) {
        return null; // gestion du required par ailleurs
      }
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        // Pas encore eu l'anniversaire cette année
        return age - 1 >= minAge ? null : { ageLimit: true };
      }
      return age >= minAge ? null : { ageLimit: true };
    };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const user: Partial<User> = {
        prenom: formValue.username,
        nom: formValue.username,
        pseudo: formValue.username,
        mail: formValue.email,
        motDePasse: formValue.password,
        genre: formValue.genre,
        dateDeNaissance: formValue.dateDeNaissance,
        pays: formValue.pays,
        role: 'user',
        telephone: '',
        image: null
      };

      this.userService.createUser(user).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (error) => {
          console.error('Erreur lors de la création de l\'utilisateur', error);

          if (error.error?.message === 'EMAIL_ALREADY_USED') {
            this.messageService.add({
              severity: 'warn',
              summary: 'E-mail déjà utilisé',
              detail: 'Cet e-mail est déjà associé à un compte.'
            });

            // Met le champ en erreur rouge
            this.registerForm.controls['email'].setErrors({ emailUsed: true });
            this.registerForm.controls['email'].markAsTouched();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur serveur',
              detail: 'Une erreur est survenue. Veuillez réessayer.'
            });
          }
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
