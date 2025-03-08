import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {Details} from '@/core/model/Details';
import {StatYear} from '@/core/model/StatYear';
import {DetailsDetailsService} from '@/core/service/details-details.service';
import {DetailsDetialsComponent} from '@/features/scpi/details/components/scpi-details/details-detials.component';
import {
  DetailsGlobalViewComponent
} from '@/features/scpi/details/components/scpi-global-view/details-global-view.component';
import {ActivatedRoute} from '@angular/router';
import {TabViewModule} from 'primeng/tabview';
import {TranslateModule} from '@ngx-translate/core';
import {ScpiHistoryDetailsComponent} from '../components/scpi-history/scpi-history-details.component';
import {MessageService} from 'primeng/api';
import {Sector} from '@/core/model/Sector';

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
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  details: Details | null = null;
  detailsService = inject(DetailsDetailsService);
  stat: StatYear | null = null;
  id_parent: number = -1;
  id_string: string | null = '';
  vue: string = 'Details.VUE';
  history: string = 'Details.HISTORIQUE';

  mostSector: Sector | null = null;
  activeTab: string = 'vue';

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
  }

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
}
