import { Routes } from '@angular/router';
import { authGuard } from '@core/auth/auth.guard';
import { adminGuard } from '@core/auth/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'globe',
    loadComponent: () => import('./features/globe/globe.component').then(m => m.GlobeComponent)
  },
  {
    path: 'watchlist',
    canActivate: [authGuard],
    loadComponent: () => import('./features/watchlist/watchlist.component').then(m => m.WatchlistComponent)
  },
  {
    path: 'compare',
    canActivate: [authGuard],
    loadComponent: () => import('./features/compare/compare-properties.component').then(m => m.ComparePropertiesComponent)
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () => import('./features/notifications/notifications-center.component').then(m => m.NotificationsCenterComponent)
  },
  {
    path: 'properties',
    loadComponent: () => import('./features/properties/properties.component').then(m => m.PropertiesComponent)
  },
  {
    path: 'properties/:id',
    loadComponent: () => import('./features/property-detail/property-detail.component').then(m => m.PropertyDetailComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'how-it-works',
    loadComponent: () => import('./features/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent)
  },
  {
    path: 'insights',
    loadComponent: () => import('./features/market-insights/market-insights.component').then(m => m.MarketInsightsComponent)
  },
  {
    path: 'calculator',
    loadComponent: () => import('./features/calculator/calculator.component').then(m => m.CalculatorComponent)
  },
  {
    path: 'support',
    loadComponent: () => import('./features/support/support.component').then(m => m.SupportComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/terms-conditions/terms-conditions.component').then(m => m.TermsConditionsComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
