import {Component, inject, Input, OnInit} from '@angular/core';
import {IftaLabelModule} from 'primeng/iftalabel';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DividerModule} from 'primeng/divider';
import {PanelModule} from 'primeng/panel';
import {Details} from '@/core/model/Details';
import {DetailsDetailsService} from '@/core/service/details-details.service';
import {StatYear} from '@/core/model/StatYear';
import {Sector} from '@/core/model/Sector';

@Component({
  selector: 'app-details-detials',
  imports: [IftaLabelModule, FormsModule, CommonModule, ButtonModule, CardModule, DividerModule, PanelModule],
  templateUrl: './details-detials.component.html',
  styleUrl: './details-detials.component.css'
})
export class DetailsDetialsComponent implements OnInit {
  @Input() details: Details | null = null;
  stat: StatYear | null = null;
  sectors: Sector | null = null;
  detailsService = inject(DetailsDetailsService);
  prix_retrait: number = 0;
  @Input() id_parent: number = -2000;

  ngOnInit(): void {
    this.getTheDetails(this.id_parent);
  }

  getTheDetails(id: number) {

          if(!this.details) return;
          this.stat = this.detailsService.getLastStats(this.details);
          if (this.stat) {
            this.prix_retrait = this.stat?.sharePrice - (this.stat?.sharePrice * ( this.details.subscriptionFees /100))
          } else {
            alert("There is no stat year");
          }


  }
}
