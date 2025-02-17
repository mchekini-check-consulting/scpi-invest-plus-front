import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DetailsDetailsService } from '../../services/details-details.service';
import { Details } from '../../models/class/Details';
import { DetailsDetialsComponent } from '../details-detials/details-detials.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Location} from '@angular/common';
import { DetailsGlobalViewComponent } from "../details-global-view/details-global-view.component";
@Component({
  selector: 'app-details',
  imports: [CardModule, ButtonModule, DetailsDetialsComponent, FormsModule, CommonModule, DetailsGlobalViewComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
  
  details: Details | null = null;
  detailsService = inject(DetailsDetailsService);
  actualPage :string = ""
  //TODO: When the repo is merged , I will try to get the id from the precedent page
  id_parent:number=2; // It is just a test

  constructor(private _location: Location) 
  {}
  ngOnInit(): void {
      this.loadNameRandMin();
  }
  /**
   * Call the server to get the details about the spci.
   * @param 
   * 
   */
  loadNameRandMin(){
    this.detailsService.getDetailsScpi(this.id_parent ).subscribe((res=>{
      this.details = res;
    }))
  }

  /**
   * Detect the desired part in Details (details, history or view)
   * @param {string wantedPage}
   */
  changePage(wantedPage: string){
    this.actualPage = wantedPage;

    
  }
  backClicked() {
    this._location.back();
  }
  
}
