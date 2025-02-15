import { ScpiModel } from '@/core/model/scpi.model';
import { ScpiService } from '@/core/service/scpi.service';
import { Component } from '@angular/core';
import { ScpiCardComponent } from './components/scpi-card/scpi-card.component';
import { ScpiHeaderComponent } from './components/scpi-header/scpi-header.component';

@Component({
  selector: 'app-scpi',
  imports: [ScpiCardComponent, ScpiHeaderComponent],
  templateUrl: './scpi.component.html',
  styleUrl: './scpi.component.css',
  providers: [ScpiService],
})
export class ScpiComponent {
  scpis: ScpiModel[] = [];

  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);

  constructor(private scpiService: ScpiService) {
    this.scpiService.get().subscribe((data) => {
      this.scpis = data;
    });
  }

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
  }
}
