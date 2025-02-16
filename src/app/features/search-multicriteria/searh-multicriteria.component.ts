import {Component} from '@angular/core';
import {Sidebar} from 'primeng/sidebar';
import {Slider} from 'primeng/slider';
import {FormsModule} from '@angular/forms';
import {MultiSelect} from 'primeng/multiselect';
import {SelectButton} from "primeng/selectbutton";
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-searh-multicriteria',
  imports: [
    Sidebar,
    Slider,
    FormsModule,
    MultiSelect,
    SelectButton,
    ButtonDirective
  ],
  templateUrl: './searh-multicriteria.component.html',
  styleUrl: './searh-multicriteria.component.css'
})
export class SearhMulticriteriaComponent {
  isFilterVisible: boolean = false;

  filters = {
    distributionRate: 0,
    investmentZones: [],
    investmentSectors: [],
    subscriptionFees: null,
    rentalFrequency: null,
    minInvestment: 0
  };

  investmentZones = [
    { label: "France uniquement", value: "france" },
    { label: "Europe", value: "europe" }
  ];

  investmentSectors = [
    { label: "Santé", value: "sante" },
    { label: "Commerces", value: "commerces" },
    { label: "Hôtels", value: "hotels" },
    { label: "Bureaux", value: "bureaux" }
  ];

  subscriptionFeesOptions = [
    { label: "Avec frais", value: "avec_frais" },
    { label: "Sans frais", value: "sans_frais" }
  ];

  rentalFrequencyOptions = [
    { label: "Mensuelle", value: "mensuelle" },
    { label: "Trimestrielle", value: "trimestrielle" }
  ];

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  applyFilters() {
    console.log("Filtres appliqués :", this.filters);
    this.isFilterVisible = false;
  }

  resetFilters() {
    this.filters = {
      distributionRate: 0,
      investmentZones: [],
      investmentSectors: [],
      subscriptionFees: null,
      rentalFrequency: null,
      minInvestment: 0
    };
  }

  isSearchDisabled(): boolean {
    return Object.values(this.filters).every(value => !value || (Array.isArray(value) && value.length === 0));
  }
}
