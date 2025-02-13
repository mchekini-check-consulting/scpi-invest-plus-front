import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
@Component({
  selector: 'app-details-global-view',
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, DividerModule, PanelModule],
  templateUrl: './details-global-view.component.html',
  styleUrl: './details-global-view.component.css'
})
export class DetailsGlobalViewComponent {

}
