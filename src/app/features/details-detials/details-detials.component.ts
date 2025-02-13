import { Component, inject, Input, OnInit } from '@angular/core';
import { SidebarComponent } from "../../core/template/components/sidebar/sidebar.component";
import { NavbarComponent } from "../../core/template/components/navbar/navbar.component";
import { FooterComponent } from "../../core/template/components/footer/footer.component";
import { IftaLabelModule } from 'primeng/iftalabel';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { Details } from '../../models/class/Details';
import { DetailsDetailsService } from '../../services/details-details.service';

@Component({
  selector: 'app-details-detials',
  imports: [ IftaLabelModule, FormsModule, CommonModule,ButtonModule, CardModule, DividerModule,PanelModule],
  templateUrl: './details-detials.component.html',
  styleUrl: './details-detials.component.css'
})
export class DetailsDetialsComponent implements OnInit{
  details:Details | null = null;;
  detailsService = inject(DetailsDetailsService);
  prix_retrait: number = 0;
  @Input() id_parent:number=-2000;
  ngOnInit(): void {
    this.getTheDetails(this.id_parent);
    console.log("the recived id is = ", this.id_parent)
  }
  // Get the details of the scpi from the database
  getTheDetails(id:number){
    this.detailsService.getDetailsScpi(this.id_parent).subscribe({
      next: (res) => {
        if (res) {
          this.details = res;
          this.prix_retrait = this.details.share_price - (this.details.share_price * (1 - this.details.subscription_fees))
        } else {
          console.warn("Received undefined details.");
        }
      },
      error: (err) => console.error("Error fetching details:", err)
    });
  }
}
