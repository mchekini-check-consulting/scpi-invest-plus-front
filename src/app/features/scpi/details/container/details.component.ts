import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Details } from '../../../../core/model/Details';
import { StatYear } from '../../../../core/model/StatYear';
import { DetailsDetailsService } from '../../../../core/service/details-details.service';
import { DetailsDetialsComponent } from '@/features/scpi/details/components/details-detials/details-detials.component';
import { DetailsGlobalViewComponent } from '@/features/scpi/details/components/details-global-view/details-global-view.component';
import { ActivatedRoute } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { TranslateModule } from '@ngx-translate/core';
import { ScpiHistoryDetailsComponent } from '../components/details-history/scpi-history-details.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Sector } from '@/core/model/Sector';

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
  vue: string = 'Details.VUE';
  history: string = 'Details.HISTORIQUE';
  _details: string = 'Details.DETAILS';

  mostSector: Sector | null = null;
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
      (res: Details) => {
        this.details = res;
        this.stat = this.detailsService.getLastStats(this.details);
        this.mostSector = this.detailsService.getMaxSectorLastYear(
          this.details
        );
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
