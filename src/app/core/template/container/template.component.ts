import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from '../components/footer/footer.component';
import {NavbarComponent} from '../components/navbar/navbar.component';
import {SidebarComponent} from '../components/sidebar/sidebar.component';
import {SearchBarComponent} from '../../../features/scpi/components/search-bar/search-bar.component';
@Component({
  selector: 'app-template',
  imports: [
    SidebarComponent,
    NavbarComponent,
    FooterComponent,
    RouterOutlet, 
    SearchBarComponent
  ],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent {

}
