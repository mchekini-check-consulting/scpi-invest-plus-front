import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-details-detials',
  imports: [ IftaLabelModule, FormsModule, CommonModule,ButtonModule, CardModule, DividerModule,PanelModule],
  templateUrl: './details-detials.component.html',
  styleUrl: './details-detials.component.css'
})
export class DetailsDetialsComponent implements OnInit{

  ngOnInit(): void {
      
  }

  getTheDetails(){
    
  }
}
