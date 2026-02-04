import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { RegisterData } from '@core/auth/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerData = signal<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
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

    this.authService.register(this.registerData()).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  updateField(field: keyof RegisterData, value: string): void {
    this.registerData.update(data => ({ ...data, [field]: value }));
  }
}
