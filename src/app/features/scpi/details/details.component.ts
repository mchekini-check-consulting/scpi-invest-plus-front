import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Details } from '../../../core/model/Details';
import { StatYear } from '../../../core/model/StatYear';
import { DetailsDetailsService } from '../../../core/service/details-details.service';
import { DetailsDetialsComponent } from '../details-detials/details-detials.component';
import { DetailsGlobalViewComponent } from '../details-global-view/details-global-view.component';
import { ActivatedRoute } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { TranslateModule } from '@ngx-translate/core';
import { ScpiHistoryDetailsComponent } from '../details-history/scpi-history-details.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-details',
  imports: [
    CardModule,
    TabViewModule,
    ButtonModule,
    DetailsDetialsComponent,
    FormsModule,
    CommonModule,
    DetailsGlobalViewComponent,
    TranslateModule,
    ScpiHistoryDetailsComponent,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {

  details: Details | null = null;
  detailsService = inject(DetailsDetailsService);
  actualPage: string = 'vue';
  stat: StatYear | null = null;
  id_parent: number = -1;
  id_string: string | null = '';
  retour: string = 'Details.RETOUR';
  vue: string = 'Details.VUE';
  history: string = 'Details.HISTORIQUE';
  _details: string = 'Details.DETAILS';


  activeTab: string = 'vue';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  constructor(
    private _location: Location,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.id_string = this.route.snapshot.paramMap.get('id');
    if (!this.id_string) return;
    this.id_parent = parseInt(this.id_string);
    this.loadNameRandMin();
  }

  loadNameRandMin() {
    this.detailsService.getDetailsScpi(this.id_parent).subscribe(
      (res) => {
        this.details = res;
        this.stat =
          this.details.statYears && this.details.statYears.length > 0
            ? this.details.statYears.reduce((prev, current) =>
                prev.yearStat.yearStat > current.yearStat.yearStat
                  ? prev
                  : current
              )
            : null;
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur de chargement des données',
        });
      }
    );
  }

  changePage(wantedPage: string) {
    this.actualPage = wantedPage;
  }

  backClicked() {
    this._location.back();
  }
}
