import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WatchlistItem, WatchlistService } from '@core/services/watchlist.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.scss'
})
export class WatchlistComponent {
  constructor(
    private watchlistService: WatchlistService,
    private toastService: ToastService
  ) {}

  items(): WatchlistItem[] {
    return this.watchlistService.items$();
  }

  remove(id: string): void {
    this.watchlistService.remove(id);
    this.toastService.show('Removed from watchlist', 'success');
  }
}
