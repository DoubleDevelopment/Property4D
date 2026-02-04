import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '@core/services/property.service';
import { Property } from '@core/models/property.models';
import { AuthService } from '@core/auth/auth.service';
import { WatchlistService } from '@core/services/watchlist.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent implements OnInit {
  private router = inject(Router);
  private propertyService = inject(PropertyService);
  private authService = inject(AuthService);
  private watchlistService = inject(WatchlistService);
  private toastService = inject(ToastService);

  properties = signal<Property[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.isLoading.set(true);
    this.propertyService.getProperties().subscribe({
      next: (properties) => {
        this.properties.set(properties);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  isSaved(id: string): boolean {
    return this.watchlistService.isSaved(id);
  }

  toggleWatchlist(property: Property, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    const saved = this.watchlistService.toggle({
      id: property.id,
      title: property.title,
      location: `${property.location.city}, ${property.location.country}`,
      image: property.images[0],
      price: property.price,
      currency: property.currency
    });

    this.toastService.show(
      saved ? 'Saved to watchlist' : 'Removed from watchlist',
      'success'
    );
  }
}
