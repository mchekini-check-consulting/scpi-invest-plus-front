import { ScpiModel } from '@/core/model/scpi.model';
import { ScpiService } from '@/core/service/scpi.service';
import { Component } from '@angular/core';
import { ScpiCardComponent } from './components/scpi-card/scpi-card.component';
import { ScpiHeaderComponent } from './components/scpi-header/scpi-header.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@Component({
  selector: 'app-scpi',
  imports: [ScpiCardComponent, ScpiHeaderComponent, SearchBarComponent],
  templateUrl: './scpi.component.html',
  styleUrl: './scpi.component.css',
  providers: [ScpiService],
})
export class ScpiComponent {
  scpis: ScpiModel[] = [];

  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);

  constructor(private scpiService: ScpiService) {
    this.scpiService.get().subscribe((data) => {
      console.log("Résultats mockés :", data);
      this.scpis = data;
    });
  }
  onSearchResultsChanged(results: ScpiModel[]) {
    this.scpis = results; // Mise à jour de la liste affichée
  }
  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
  }
}
