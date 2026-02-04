import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '@core/services/property.service';
import { Property } from '@core/models/property.models';
import { AuthService } from '@core/auth/auth.service';
import { WatchlistService } from '@core/services/watchlist.service';
import { ToastService } from '@core/services/toast.service';
import { RecentlyViewedService } from '@core/services/recently-viewed.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.scss'
})
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private propertyService = inject(PropertyService);
  private authService = inject(AuthService);
  private watchlistService = inject(WatchlistService);
  private toastService = inject(ToastService);
  private recentlyViewedService = inject(RecentlyViewedService);

  property = signal<Property | null>(null);
  isLoading = signal<boolean>(false);
  selectedImageIndex = signal<number>(0);
  isSaved = computed(() => {
    const p = this.property();
    if (!p) return false;
    return this.watchlistService.isSaved(p.id);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(id);
    }
  }

  loadProperty(id: string): void {
    this.isLoading.set(true);
    this.propertyService.getPropertyById(id).subscribe({
      next: (property) => {
        this.property.set(property);
        this.recentlyViewedService.record({
          id: property.id,
          title: property.title,
          location: `${property.location.city}, ${property.location.country}`,
          image: property.images[0]
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  toggleWatchlist(): void {
    const p = this.property();
    if (!p) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: this.router.url }
      });
      return;
    }

    const saved = this.watchlistService.toggle({
      id: p.id,
      title: p.title,
      location: `${p.location.city}, ${p.location.country}`,
      image: p.images[0],
      price: p.price,
      currency: p.currency
    });

    this.toastService.show(
      saved ? 'Saved to watchlist' : 'Removed from watchlist',
      'success'
    );
  }

  formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }
}
