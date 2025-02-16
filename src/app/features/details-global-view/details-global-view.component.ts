import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { Details } from '../../models/class/Details';
import { DetailsDetailsService } from '../../services/details-details.service';
@Component({
  selector: 'app-details-global-view',
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, DividerModule, PanelModule],
  templateUrl: './details-global-view.component.html',
  styleUrl: './details-global-view.component.css'
})
export class DetailsGlobalViewComponent implements OnInit{
  details:Details| null = null;
  @Input() id_parent:number = 0;
  detailsService = inject(DetailsDetailsService);
  ngOnInit(): void {
      this.getScpiGlobalInformation();
  }

  getScpiGlobalInformation(){
    this.detailsService.getDetailsScpi(this.id_parent).subscribe(res=>{
      this.details  = res;
    }, (error)=>{
      console.log("Error occured during the loading of the informations.");
      console.error(error);
    })
  }
}
