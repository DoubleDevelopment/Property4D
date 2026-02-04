import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Property, PropertyFilter } from '@core/models/property.models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private properties = signal<Property[]>([]);
  private selectedProperty = signal<Property | null>(null);
  private isLoading = signal<boolean>(false);

  readonly properties$ = this.properties.asReadonly();
  readonly selectedProperty$ = this.selectedProperty.asReadonly();
  readonly isLoading$ = this.isLoading.asReadonly();

  constructor(private http: HttpClient) {}

  getProperties(filter?: PropertyFilter): Observable<Property[]> {
    this.isLoading.set(true);
    
    return this.http.get<Property[]>(`${environment.apiUrl}/properties`, {
      params: this.buildFilterParams(filter)
    }).pipe(
      tap(properties => {
        this.properties.set(properties);
        this.isLoading.set(false);
      })
    );
  }

  getPropertyById(id: string): Observable<Property> {
    this.isLoading.set(true);
    
    return this.http.get<Property>(`${environment.apiUrl}/properties/${id}`).pipe(
      tap(property => {
        this.selectedProperty.set(property);
        this.isLoading.set(false);
      })
    );
  }

  searchProperties(searchTerm: string): Observable<Property[]> {
    return this.http.get<Property[]>(`${environment.apiUrl}/properties/search`, {
      params: { q: searchTerm }
    }).pipe(
      tap(properties => this.properties.set(properties))
    );
  }

  private buildFilterParams(filter?: PropertyFilter): Record<string, string> {
    if (!filter) return {};

    const params: Record<string, string> = {};

    if (filter.type?.length) {
      params['type'] = filter.type.join(',');
    }
    if (filter.priceRange) {
      params['minPrice'] = filter.priceRange[0].toString();
      params['maxPrice'] = filter.priceRange[1].toString();
    }
    if (filter.location) {
      params['location'] = filter.location;
    }
    if (filter.status?.length) {
      params['status'] = filter.status.join(',');
    }
    if (filter.searchTerm) {
      params['search'] = filter.searchTerm;
    }

    return params;
  }

  clearSelection(): void {
    this.selectedProperty.set(null);
  }
}
