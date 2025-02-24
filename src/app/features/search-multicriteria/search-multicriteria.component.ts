import {Component, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from 'primeng/sidebar';
import { Slider } from 'primeng/slider';
import { MultiSelect } from 'primeng/multiselect';
import { SelectButton } from 'primeng/selectbutton';
import { ButtonDirective } from 'primeng/button';
import { ScpiSearch } from "@/core/model/scpi-search.model";
import { ScpiService } from "@/core/service/scpi.service";
import { ScpiModel } from '@/core/model/scpi.model';
import { ButtonModule } from 'primeng/button';
import {SearchBarComponent} from "@/features/search-multicriteria/components/search-bar/search-bar.component";

@Component({
  selector: 'app-search-multicriteria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    Slider,
    MultiSelect,
    SelectButton,
    ButtonDirective,
    SearchBarComponent,
    ButtonModule
  ],
  templateUrl: './search-multicriteria.component.html',
  styleUrls: ['./search-multicriteria.component.css']
})
export class SearchMulticriteriaComponent {
  @Output() scpiFiltered = new EventEmitter<ScpiModel[]>();
  isFilterVisible = false;
  loading = false;
  scpiResults: ScpiModel[] = [];

  filters: ScpiSearch = {
    searchTerm: undefined,
    locations:undefined,
    sectors: undefined,
    minimumSubscription: 0,
    subscriptionFees: undefined,
    distributionRate: undefined,
    rentalFrequency: undefined,
    minInvestment: 0
  };
  constructor(private scpiService: ScpiService) {}
  applyFilters() {
    this.isFilterVisible = false;
    this.searchScpi();
  }

  onSearchTermChanged(searchTerm: string) {
    this.filters.searchTerm = searchTerm.trim();
    if (!this.filters.searchTerm) {
      this.resetFilters();
    } else {
      this.searchScpi();
    }
  }


  searchScpi() {
    if (this.isSearchDisabled()) {
      return;
    }

    let filtersToSend: ScpiSearch = this.prepareFilters();
    this.loading = true;

    this.scpiService.getScpiWithFilter(filtersToSend).subscribe(
      (data) => {
        this.scpiResults = data || [];
        this.loading = false;
        this.scpiFiltered.emit(this.scpiResults);
      },
      (error) => {
        this.scpiResults = [];
        this.loading = false;
        this.scpiFiltered.emit([]);
      }
    );
  }

  isSearchDisabled(): boolean {
    return !Object.values(this.filters).some(value =>
      (Array.isArray(value) && value.length > 0) ||
      (typeof value === 'number' && value > 0) ||
      (typeof value === 'string' && value.trim() !== "")
    );
  }

  resetFilters() {
    this.filters = this.getDefaultFilters();
    this.loading = true;

    this.scpiService.get().subscribe(
      (data) => {
        this.scpiResults = data || [];
        this.loading = false;
        this.scpiFiltered.emit(this.scpiResults);
      },
      (error) => {
        this.scpiResults = [];
        this.loading = false;
        this.scpiFiltered.emit(this.scpiResults);
        console.error("Erreur lors du rechargement des SCPI", error);
      }
    );
  }


  private prepareFilters(): ScpiSearch {
    let filtersToSend: ScpiSearch = {
      ...this.filters,
      locations: this.filters.locations && Array.isArray(this.filters.locations)
        ? this.filters.locations.map((loc: any) => loc.value ?? loc)
        : [],
      sectors: this.filters.sectors && Array.isArray(this.filters.sectors)
        ? this.filters.sectors.map((sec: any) => sec.value ?? sec)
        : [],
      distributionRate: this.filters.distributionRate !== undefined && this.filters.distributionRate !== 0
        ? this.filters.distributionRate
        : undefined,
      minInvestment: this.filters.minInvestment !== undefined && this.filters.minInvestment !== null
        ? this.filters.minInvestment
        : 0
    };

    filtersToSend = Object.fromEntries(
      Object.entries(filtersToSend).filter(([_, v]) =>
        v !== undefined && v !== null && v !== "" && (!Array.isArray(v) || v.length > 0)
      )
    ) as ScpiSearch;

    return filtersToSend;
  }
  private getDefaultFilters(): ScpiSearch {
    return {
      searchTerm: undefined,
      locations: undefined,
      sectors: undefined,
      minimumSubscription: 0,
      subscriptionFees: undefined,
      distributionRate: undefined,
      rentalFrequency: undefined,
      minInvestment: 0
    };
  }
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
  investmentZones = [
    { label: 'Europe', value: 'Europe' },
    { label: 'Grande-Bretagne', value: 'Grande-Bretagne' },
    { label: 'Espagne', value: 'Espagne' },
    { label: 'Irlande', value: 'Irlande' },
    { label: 'Italie', value: 'Italie' },
    { label: 'Allemagne', value: 'Allemagne'},
    { label: 'Pays-Bas', value: 'Pays-Bas' },
    { label: 'France', value: 'France' },
    { label: 'Pologne', value: 'Pologne' },
    { label: 'Portugal', value: 'Portugal' },
    { label: 'Belgique', value: 'Belgique' },
    { label: 'Autres', value: '' }
  ];
  investmentSectors = [
    { label: 'Santé', value: 'Santé' },
    { label: 'Commerces', value: 'Commerces' },
    { label: 'Hôtels', value: 'Hôtels' },
    { label: 'Bureaux', value: 'Bureaux' },
    { label: 'Logistique', value: 'Logistique' },
    { label: 'Résidentiel', value: 'Résidentiel'},
    {label: 'Locaux d"activité', value: 'Locaux d"activité'},
    {label: 'Transport', value: 'Transport'},

  ];
  subscriptionFeesOptions = [
    { label: 'Avec frais', value: true },
    { label: 'Sans frais', value: false }
  ];
  rentalFrequencyOptions = [
    { label: 'Mensuelle', value: 'Mensuelle' },
    { label: 'Trimestrielle', value: 'Trimestrielle' }
  ];
}
