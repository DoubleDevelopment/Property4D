import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '@core/auth/auth.service';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  isMenuOpen = signal(false);
  user = computed(() => this.authService.user());
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  themeMode = computed(() => this.themeService.mode$());

  toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this.authService.logout();
  }

  navigateToLogin(): void {
    this.closeMenu();
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.closeMenu();
    this.router.navigate(['/auth/register']);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }
}
