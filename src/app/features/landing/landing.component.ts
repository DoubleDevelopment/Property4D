import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigateToGlobe(): void {
    this.router.navigate(['/globe']);
  }

  navigateToAuth(): void {
    this.router.navigate(['/auth/register']);
  }
}
