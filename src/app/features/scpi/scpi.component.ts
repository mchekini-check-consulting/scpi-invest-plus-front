import {ScpiModel} from '@/core/model/scpi.model';
import {ScpiService} from '@/core/service/scpi.service';
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ScpiCardComponent} from './components/scpi-card/scpi-card.component';
import {SearchMulticriteriaComponent} from '@/features/search-multicriteria/search-multicriteria.component';
import {CommonModule} from '@angular/common';
import {catchError, Subscription} from 'rxjs';

@Component({
  selector: 'app-scpi',
  imports: [ScpiCardComponent, SearchMulticriteriaComponent,CommonModule],
  templateUrl: './scpi.component.html',
  styleUrl: './scpi.component.css'
})
export class ScpiComponent implements OnInit, OnDestroy {
  scpis: ScpiModel[] = [];
  filteredScpis: ScpiModel[] = [];
  loading = false;
  private subscriptions: Subscription = new Subscription();

  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);

  constructor(private scpiService: ScpiService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.filteredScpis.length === 0) {
      this.loading = true;
      this.subscriptions.add(
        this.scpiService.get()
          .pipe(
            catchError((error) => {
              this.loading = false;
              return [];
            })
          )
          .subscribe((data) => {
            this.scpis = data;
            this.filteredScpis = [...data];
            this.loading = false;
            this.cdRef.detectChanges();
          })
      );
    }
  }

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
  }

  updateScpiList(filteredList: ScpiModel[] | null | undefined) {
    if (filteredList && filteredList.length > 0) {
      this.filteredScpis = [...filteredList];
    } else {
      this.subscriptions.add(
        this.scpiService.get()
          .pipe(
            catchError((error) => {
              return [];
            })
          )
          .subscribe((allScpis) => {
            this.filteredScpis = [...allScpis];
            this.cdRef.detectChanges();
          })
      );
    }
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

