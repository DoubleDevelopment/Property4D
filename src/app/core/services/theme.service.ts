import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'property4d_theme';
  private modeSignal = signal<ThemeMode>('light');
  readonly mode$ = this.modeSignal.asReadonly();

  constructor() {
    this.applyInitialTheme();
  }

  toggle(): void {
    const next: ThemeMode = this.modeSignal() === 'dark' ? 'light' : 'dark';
    this.setMode(next);
  }

  setMode(mode: ThemeMode): void {
    this.modeSignal.set(mode);
    this.applyMode(mode);
    this.persist(mode);
  }

  private applyInitialTheme(): void {
    const saved = this.readPersisted();
    if (saved) {
      this.setMode(saved);
      return;
    }

    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.setMode(prefersDark ? 'dark' : 'light');
  }

  private applyMode(mode: ThemeMode): void {
    if (typeof document === 'undefined') return;
    const el = document.documentElement;
    el.classList.toggle('theme-dark', mode === 'dark');
  }

  private persist(mode: ThemeMode): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, mode);
    } catch {
    }
  }

  private readPersisted(): ThemeMode | null {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw === 'dark' || raw === 'light' ? raw : null;
    } catch {
      return null;
    }
  }
}
