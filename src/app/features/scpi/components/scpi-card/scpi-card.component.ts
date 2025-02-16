import { ScpiModel } from '@/core/model/scpi.model';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-scpi-card',
  standalone: true,
  imports: [CardModule, ButtonModule, DividerModule, Tag, CommonModule, RouterLink],
  templateUrl: './scpi-card.component.html',
  styleUrl: './scpi-card.component.css',
})
export class ScpiCardComponent {
  @Input() scpi!: ScpiModel;
  @Input() image!: string;
}
