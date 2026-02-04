import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-market-insights',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './market-insights.component.html',
  styleUrl: './market-insights.component.scss'
})
export class MarketInsightsComponent {}
