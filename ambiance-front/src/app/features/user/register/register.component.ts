import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { Router } from '@angular/router';
import { User } from '../../../core/models/users';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // Formulaire réactif pour l'inscription
  registerForm!: FormGroup;

  // Liste des pays proposés dans le formulaire
  countries = ['France', 'Belgique', 'Suisse', 'Canada', 'États-Unis', 'Autre'];

  // Date max autorisée dans le champ date (aujourd'hui)
  maxDate = new Date().toISOString().split('T')[0];

  passwordVisible = false;



  constructor(
    private fb: FormBuilder,           // Pour construire le formulaire réactif
    private userService: UsersService, // Service pour gérer les utilisateurs
    private router: Router,            // Pour la navigation entre pages
    private messageService: MessageService // Service PrimeNG pour afficher des messages utilisateur
  ) { }

  /**
   * Initialisation du formulaire avec validation des champs
   */
  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]], // nom utilisateur requis, min 3 caractères
        email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]], // email valide obligatoire
        password: ['', [
          Validators.required,
          Validators.minLength(12),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
        ]],
        confirmPassword: ['', Validators.required], // confirmation du mot de passe obligatoire
        reglement: [false, Validators.requiredTrue], // accord sur le règlement obligatoire (checkbox)
        genre: ['', Validators.required], // genre obligatoire
        dateDeNaissance: ['', [Validators.required, this.ageValidator(13)]], // date de naissance obligatoire et âge mini 13 ans
        pays: ['', Validators.required] // pays obligatoire
      },
      { validators: this.passwordMatchValidator } // Validation personnalisée sur tout le formulaire pour matcher les mots de passe
    );
  }

  /**
   * Validator personnalisé qui vérifie que password et confirmPassword correspondent
   * @param group groupe de contrôles du formulaire
   * @returns erreur "mismatch" si les mots de passe ne correspondent pas, sinon null
   */
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  /**
   * Validator personnalisé qui vérifie que l'âge minimum est respecté (ex: 13 ans)
   * @param minAge âge minimum requis
   * @returns fonction de validation pour Angular
   */
  ageValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthDate = new Date(control.value);
      if (!control.value) {
        return null; // Si champ vide, laisse la validation 'required' gérer le cas
      }
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        // L'anniversaire de l'année n'est pas encore passé
        age--;
      }
      return age >= minAge ? null : { ageLimit: true }; // Erreur si âge inférieur au minimum
    };
  }

  /**
   * Méthode appelée lors de la soumission du formulaire d'inscription
   * Valide le formulaire puis crée l'utilisateur via le service userService
   * Gère les erreurs (ex: email déjà utilisé) et affiche les messages correspondants
   */
  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      // Création partielle d'un objet User à partir des valeurs du formulaire
      const user: Partial<User> = {
        prenom: formValue.username,
        nom: formValue.username,
        pseudo: formValue.username,
        mail: formValue.email,
        motDePasse: formValue.password,
        genre: formValue.genre,
        dateDeNaissance: formValue.dateDeNaissance,
        pays: formValue.pays,
        role: 'Utilisateur',
        telephone: '',
        image: null
      };

      // Appel au service pour créer l'utilisateur en base
    this.userService.createUser(user).subscribe({
      next: () => {
        // Affiche message succès inscription
        this.messageService.add({
          severity: 'success',
          summary: 'Inscription réussie',
          detail: 'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter. Vous pouvez activer la double authentification par mail dans votre profil.'
        });

        // Redirige vers la page de login
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la création de l\'utilisateur', error);

        // Gestion spécifique de l'erreur email déjà utilisé
        if (error.error?.message === 'EMAIL_ALREADY_USED') {
          this.messageService.add({
            severity: 'warn',
            summary: 'E-mail déjà utilisé',
            detail: 'Cet e-mail est déjà associé à un compte.'
          });

          // Met le champ email en erreur pour affichage visuel (rouge)
          this.registerForm.controls['email'].setErrors({ emailUsed: true });
          this.registerForm.controls['email'].markAsTouched();
        } else {
          // Autres erreurs serveur générales
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur serveur',
            detail: 'Une erreur est survenue. Veuillez réessayer.'
          });
        }
      }
    });
    } else {
      // Si formulaire invalide, on marque tous les champs comme touchés pour afficher les erreurs
      this.registerForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }
}
