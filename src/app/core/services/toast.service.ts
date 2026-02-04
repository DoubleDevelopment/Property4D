import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  readonly toasts$ = this.toasts.asReadonly();

  show(message: string, type: ToastType = 'info', durationMs = 2400): void {
    const toast: Toast = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type,
      message,
      createdAt: Date.now()
    };

    this.toasts.update(list => [...list, toast]);

    window.setTimeout(() => {
      this.dismiss(toast.id);
    }, durationMs);
  }

  dismiss(id: string): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  clear(): void {
    this.toasts.set([]);
  }
}
