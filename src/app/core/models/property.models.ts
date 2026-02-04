export interface Property {
  id: string;
  title: string;
  description: string;
  location: PropertyLocation;
  price: number;
  currency: string;
  type: 'residential' | 'commercial' | 'land' | 'luxury';
  status: 'available' | 'sold' | 'pending';
  images: string[];
  timeline: PropertyTimeline[];
  features: PropertyFeature[];
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyLocation {
  address: string;
  city: string;
  country: string;
  region: string;
  postalCode?: string;
}

export interface PropertyTimeline {
  date: Date;
  phase: string;
  description: string;
  value?: number;
  type: 'development' | 'ownership' | 'value' | 'repair';
}

export interface PropertyFeature {
  name: string;
  value: string | number;
  category: 'size' | 'amenity' | 'architectural' | 'investment';
}

export interface PropertyFilter {
  type?: string[];
  priceRange?: [number, number];
  location?: string;
  status?: string[];
  searchTerm?: string;
}
