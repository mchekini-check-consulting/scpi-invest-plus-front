import {ScpiModel} from '@/core/model/scpi.model';
import {ScpiService} from '@/core/service/scpi.service';
import {Component} from '@angular/core';
import {ScpiCardComponent} from './components/scpi-card/scpi-card.component';
import {SearchMulticriteriaComponent} from '@/features/search-multicriteria/search-multicriteria.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-scpi',
  imports: [ScpiCardComponent, SearchMulticriteriaComponent,CommonModule],
  templateUrl: './scpi.component.html',
  styleUrl: './scpi.component.css',
  providers: [ScpiService],
})
export class ScpiComponent {
  scpis: ScpiModel[] = [];
  filteredScpis: ScpiModel[] = [];
  loading = false;

  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);

  constructor(private scpiService: ScpiService) {
    this.scpiService.get().subscribe((data) => {
      this.scpis = data;
      this.filteredScpis = data;
      this.loading = false;
    });
  }

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
  }
  updateScpiList(filteredList: ScpiModel[]) {
    console.log("🔄 Mise à jour des SCPI :", filteredList);
    this.filteredScpis = filteredList;
  }
}
