import { Component, inject, Input, OnInit } from '@angular/core';
import { IftaLabelModule } from 'primeng/iftalabel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { Details } from '../../../models/Details';
import { DetailsDetailsService } from '../../../services/details-details.service';
import { StatYear } from '../../../models/StatYear';
import { Sector } from '../../../models/Sector';

@Component({
  selector: 'app-details-detials',
  imports: [IftaLabelModule, FormsModule, CommonModule, ButtonModule, CardModule, DividerModule, PanelModule],
  templateUrl: './details-detials.component.html',
  styleUrl: './details-detials.component.css'
})
export class DetailsDetialsComponent implements OnInit {
  details: Details | null = null;
  stat: StatYear | null = null;
  sectors: Sector | null = null;
  detailsService = inject(DetailsDetailsService);
  prix_retrait: number = 0;
  @Input() id_parent: number = -2000;
  ngOnInit(): void {
    this.getTheDetails(this.id_parent);
  }
  getTheDetails(id: number) {
    this.detailsService.getDetailsScpi(this.id_parent).subscribe({
      next: (res) => {
        if (res) {
          this.details = res;
          this.stat = this.details.statYears && this.details.statYears.length > 0
            ? this.details.statYears.reduce((prev, current) => (prev.yearStat.yearStat > current.yearStat.yearStat ? prev : current)) : null
          if (this.stat) {
            this.prix_retrait = this.stat?.sharePrice - (this.stat?.sharePrice * (1 - this.details.subscriptionFees))
          } else {
            alert("There is no stat year");
          }
        } else {
          alert("Received undefined details.");
        }
      },
      error: (err) => console.error("Error fetching details:", err)
    });
  }
}
