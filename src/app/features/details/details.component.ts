import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Details } from '../../models/class/Details';
import { StatYear } from '../../models/class/StatYear';
import { DetailsDetailsService } from '../../services/details-details.service';
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
  //TODO: When the repo is merged , I will try to get the id from the precedent page
  id_parent: number = 1; // It is just a test

  constructor(private _location: Location) {}
  ngOnInit(): void {
    this.loadNameRandMin();
  }
  /**
   * Call the server to get the details about the spci.
   * @param
   *
   */
  loadNameRandMin() {
    this.detailsService.getDetailsScpi(this.id_parent).subscribe((res) => {
      this.details = res;
      this.stat =
        this.details.statYears && this.details.statYears.length > 0
          ? this.details.statYears.reduce((prev, current) =>
              prev.year > current.year ? prev : current
            )
          : null;

      console.log('Details = ', this.details);
      console.log('Stat = ', this.stat);
    });
  }

  /**
   * Detect the desired part in Details (details, history or view)
   * @param {string wantedPage}
   */
  changePage(wantedPage: string) {
    this.actualPage = wantedPage;
  }
  backClicked() {
    this._location.back();
  }
}
