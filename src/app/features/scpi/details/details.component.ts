import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Details } from '../../../models/Details';
import { StatYear } from '../../../models/StatYear';
import { DetailsDetailsService } from '../../../services/details-details.service';
import { DetailsDetialsComponent } from '../details-detials/details-detials.component';
import { DetailsGlobalViewComponent } from '../details-global-view/details-global-view.component';
@Component({
  selector: 'app-details',
  imports: [
    CardModule,
    ButtonModule,
    DetailsDetialsComponent,
    FormsModule,
    CommonModule,
    DetailsGlobalViewComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  details: Details | null = null;
  detailsService = inject(DetailsDetailsService);
  actualPage: string = '';
  stat: StatYear | null = null;
  id_parent: number = 1;

  constructor(private _location: Location) { }
  ngOnInit(): void {
    this.loadNameRandMin();
  }

  loadNameRandMin() {
    this.detailsService.getDetailsScpi(this.id_parent).subscribe((res) => {
      this.details = res;
      console.log('Stat = ', this.details.statYears && this.details.statYears.length > 0
        ? this.details.statYears.reduce((prev, current) =>
          prev.yearStat.yearStat > current.yearStat.yearStat ? prev : current
          
        )
        : null);
      this.stat =
        this.details.statYears && this.details.statYears.length > 0
          ? this.details.statYears.reduce((prev, current) =>
            prev.yearStat.yearStat > current.yearStat.yearStat ? prev : current
            
          )
          : null;
      
    });
  }

  changePage(wantedPage: string) {
    this.actualPage = wantedPage;
  }

  backClicked() {
    this._location.back();
  }
}
