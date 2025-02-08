import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{

  year : number = 0;

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }

}
