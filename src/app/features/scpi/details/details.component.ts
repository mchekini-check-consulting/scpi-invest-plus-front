import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Details } from '../../../core/model/Details';
import { StatYear } from '../../../core/model/StatYear';
import { DetailsDetailsService } from '../../../core/service/details-details.service';
import { DetailsDetialsComponent } from '../details-detials/details-detials.component';
import { DetailsGlobalViewComponent } from '../details-global-view/details-global-view.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-details',
  imports: [
    CardModule,
    ButtonModule,
    DetailsDetialsComponent,
    FormsModule,
    CommonModule,
    DetailsGlobalViewComponent,
    TranslateModule
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  details: Details | null = null;
  detailsService = inject(DetailsDetailsService);
  actualPage: string = '';
  stat: StatYear | null = null;
  id_parent: number = -1;
  id_string: string | null = "";
  retour: string = 'Details.RETOUR';
  vue: string = 'Details.VUE';
  history: string = 'Details.HISTORIQUE';
  _details: string = 'Details.DETAILS';
  constructor(private _location: Location, private route: ActivatedRoute) { }
  ngOnInit(): void {

    this.id_string = this.route.snapshot.paramMap.get('id');

    if (!this.id_string) return;
    this.id_parent = parseInt(this.id_string)

    this.loadNameRandMin();
  }

  loadNameRandMin() {
    this.detailsService.getDetailsScpi(this.id_parent).subscribe((res) => {
      this.details = res;
      this.stat = this.details.statYears && this.details.statYears.length > 0
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
