import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { WatchlistService } from '@core/services/watchlist.service';
import { RecentlyViewedService } from '@core/services/recently-viewed.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss'
})
export class ClientDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private watchlistService = inject(WatchlistService);
  private recentlyViewedService = inject(RecentlyViewedService);

  user = computed(() => this.authService.user());
  savedProperties = computed(() => this.watchlistService.items$().slice(0, 6));

  recentlyViewed = computed(() => this.recentlyViewedService.items$().slice(0, 6));

  ngOnInit(): void {
  }
}
