export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'admin';
  createdAt: Date;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  savedProperties: string[];
  watchlists: string[];
  notifications: boolean;
  theme: 'light' | 'dark';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  investorType?: string;
  interests?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
