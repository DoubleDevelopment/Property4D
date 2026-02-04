import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications-center',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications-center.component.html',
  styleUrl: './notifications-center.component.scss'
})
export class NotificationsCenterComponent {}
