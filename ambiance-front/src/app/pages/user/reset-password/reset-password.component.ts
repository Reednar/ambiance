import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../../service/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  token: string | null = null;
  newPassword: string = '';
  message: string = '';
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.error = 'Token manquant dans l’URL';
    }
  }

  onSubmit() {
    if (!this.token) return;

    this.message = '';
    this.error = '';

    this.userService.resetPassword(this.token, this.newPassword)
      .subscribe({
        next: res => {
          this.message = res.message;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: err => {
          this.error = err.error?.message || 'Erreur lors de la réinitialisation';
        }
      });
  }

}
