import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-compare-properties',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './compare-properties.component.html',
  styleUrl: './compare-properties.component.scss'
})
export class ComparePropertiesComponent {}
