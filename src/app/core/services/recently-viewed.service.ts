import { Injectable, signal } from '@angular/core';

export interface RecentlyViewedItem {
  id: string;
  title: string;
  location: string;
  image?: string;
  viewedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {
  private readonly STORAGE_KEY = 'property4d_recently_viewed';
  private readonly MAX_ITEMS = 12;

  private items = signal<RecentlyViewedItem[]>(this.loadFromStorage());
  readonly items$ = this.items.asReadonly();

  record(item: Omit<RecentlyViewedItem, 'viewedAt'>): void {
    const now = Date.now();
    this.items.update(list => {
      const without = list.filter(i => i.id !== item.id);
      const next = [{ ...item, viewedAt: now }, ...without];
      return next.slice(0, this.MAX_ITEMS);
    });
    this.persist();
  }

  clear(): void {
    this.items.set([]);
    this.persist();
  }

  private persist(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
    } catch {
    }
  }

  private loadFromStorage(): RecentlyViewedItem[] {
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
