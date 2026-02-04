import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { LoginCredentials } from '@core/auth/auth.models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = signal<LoginCredentials>({
    email: '',
    password: ''
  });

  error = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error.set(null);
    this.isLoading.set(true);

    this.authService.login(this.credentials()).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Login failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  updateEmail(value: string): void {
    this.credentials.update(cred => ({ ...cred, email: value }));
  }

  updatePassword(value: string): void {
    this.credentials.update(cred => ({ ...cred, password: value }));
  }
}
