import { ScpiModel } from '@/core/model/scpi.model';
import { ScpiService } from '@/core/service/scpi.service';
import { SearchMulticriteriaComponent } from '@/features/search-multicriteria/search-multicriteria.component';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { catchError, Subscription } from 'rxjs';
import { ScpiCardComponent } from './components/scpi-card/scpi-card.component';

@Component({
  selector: 'app-scpi',
  imports: [ScpiCardComponent, SearchMulticriteriaComponent, CommonModule],
  templateUrl: './scpi.component.html',
  styleUrl: './scpi.component.css',
})
export class ScpiComponent implements OnInit, OnDestroy {
  scpis: ScpiModel[] = [];
  filteredScpis: ScpiModel[] = [];
  loading = false;
  private subscriptions: Subscription = new Subscription();

  @Input() isAddingScpi = false;

  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);

  constructor(
    private scpiService: ScpiService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (this.filteredScpis.length === 0) {
      this.loading = true;
      this.subscriptions.add(
        this.scpiService
          .get()
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

  getImage(id: number): string {
    return this.images[id % this.images.length];
  }
  updateScpiList(filteredList: ScpiModel[] | null | undefined) {
    if (filteredList && filteredList.length > 0) {
      this.filteredScpis = [...filteredList];
    } else {
      this.filteredScpis = [];
    }
    this.cdRef.detectChanges();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
