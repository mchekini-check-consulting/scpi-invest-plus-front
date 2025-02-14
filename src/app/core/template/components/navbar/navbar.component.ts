import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { RouterModule } from '@angular/router';
import {CommonModule, NgFor} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

interface Lang {
  name: string;
  code: string;
  flag: string;
}


@Component({
  selector: 'app-navbar',
  imports: [NgFor, TranslateModule, CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  lang: Lang[] | undefined;

  selectedLang: String = "Français";
  selectedFlag: string = 'img/Flag_fr.png';

  username: string | undefined = '';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('fr');
  }

  ngOnInit() {
    this.lang = ([
      {name: "Français", code: "fr", flag: 'img/Flag_fr.png'},
      {name: "English", code: "en", flag: 'img/Flag_gb.png'},
    ]);

  }

  switchLanguage(language: string) {
    const selectedLanguage = this.lang!.find(lang => lang.code === language);
    if (selectedLanguage) {
      this.selectedLang = selectedLanguage.name;
      this.selectedFlag = selectedLanguage.flag;
    }
    this.translate.use(language);
  }


}
