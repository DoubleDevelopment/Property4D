import { Injectable, signal } from '@angular/core';

export interface WatchlistItem {
  id: string;
  title: string;
  location: string;
  image?: string;
  price?: number;
  currency?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private readonly STORAGE_KEY = 'property4d_watchlist';

  private items = signal<WatchlistItem[]>(this.loadFromStorage());
  readonly items$ = this.items.asReadonly();

  isSaved(propertyId: string): boolean {
    return this.items().some(i => i.id === propertyId);
  }

  add(item: WatchlistItem): void {
    if (this.isSaved(item.id)) return;
    this.items.update(items => [item, ...items]);
    this.persist();
  }

  remove(propertyId: string): void {
    this.items.update(items => items.filter(i => i.id !== propertyId));
    this.persist();
  }

  toggle(item: WatchlistItem): boolean {
    if (this.isSaved(item.id)) {
      this.remove(item.id);
      return false;
    }

    this.add(item);
    return true;
  }

  private persist(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
    } catch {
    }
  }

  private loadFromStorage(): WatchlistItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
