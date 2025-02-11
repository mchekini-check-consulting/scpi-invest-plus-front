import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DetailsDetailsService } from '../../services/details-details.service';
import { Details } from '../../models/class/Details';
import { DetailsDetialsComponent } from '../details-detials/details-detials.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Location} from '@angular/common';
@Component({
  selector: 'app-details',
  imports: [CardModule , ButtonModule, DetailsDetialsComponent, FormsModule, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
  
  details: Details | null = null;
  detailsService = inject(DetailsDetailsService);
  actualPage :string = ""
  id_parent:number=2;

  constructor(private _location: Location) 
  {}
  ngOnInit(): void {
      this.loadNameRandMin();
  }

  loadNameRandMin(){
    this.detailsService.getDetailsScpi(this.id_parent ).subscribe((res=>{
      this.details = res;
      console.log("Load name = ", this.details)
    }))
  }

  changePage(wantedPage: string){
    console.log('wanted = ', wantedPage);
    this.actualPage = wantedPage;

    
  }
  backClicked() {
    this._location.back();
  }
  
}
