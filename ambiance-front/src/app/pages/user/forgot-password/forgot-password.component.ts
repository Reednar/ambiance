import { Component } from '@angular/core';
import { UsersService } from '../../../service/users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  error: string = '';

  constructor(private usersService: UsersService) {}

  onSubmit() {
    this.message = '';
    this.error = '';

    this.usersService.forgotPassword(this.email).subscribe({
      next: (res: { message: string; }) => this.message = res.message,
      error: (err: { error: { message: string; }; }) => this.error = err.error?.message || 'Erreur lors de l’envoi de l’email'
    });
  }
}
