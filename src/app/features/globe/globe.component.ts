import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobeService } from '@core/services/globe.service';
import { PropertyService } from '@core/services/property.service';

@Component({
  selector: 'app-globe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './globe.component.html',
  styleUrl: './globe.component.scss'
})
export class GlobeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: false }) globeContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private globeService: GlobeService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.propertyService.getProperties().subscribe(properties => {
      properties.forEach(property => {
        this.globeService.addPropertyNode(
          property.id,
          property.coordinates.lat,
          property.coordinates.lng
        );
      });
    });
  }

  ngAfterViewInit(): void {
    if (this.globeContainer) {
      this.globeService.initializeGlobe(this.globeContainer.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.globeService.dispose();
  }
}
