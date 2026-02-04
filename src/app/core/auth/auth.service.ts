import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { User, LoginCredentials, RegisterData, AuthResponse, AuthState } from './auth.models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'property4d_token';
  private readonly USER_KEY = 'property4d_user';
  
  private authState = signal<AuthState>({
    user: this.getUserFromStorage(),
    token: this.getTokenFromStorage(),
    isAuthenticated: !!this.getTokenFromStorage(),
    isLoading: false
  });

  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly isLoading = computed(() => this.authState().isLoading);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.setLoading(true);
    
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        this.setLoading(false);
        throw error;
      })
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    this.setLoading(true);
    
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(error => {
        this.setLoading(false);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
    
    this.router.navigate(['/']);
  }

  refreshToken(): Observable<AuthResponse> {
    const token = this.getTokenFromStorage();
    if (!token) {
      return of({} as AuthResponse);
    }

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/refresh`, { token }).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
      }),
      catchError(() => {
        this.logout();
        return of({} as AuthResponse);
      })
    );
  }

  getToken(): string | null {
    return this.authState().token;
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    
    this.authState.set({
      user: response.user,
      token: response.token,
      isAuthenticated: true,
      isLoading: false
    });
  }

  private setLoading(loading: boolean): void {
    this.authState.update(state => ({ ...state, isLoading: loading }));
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
