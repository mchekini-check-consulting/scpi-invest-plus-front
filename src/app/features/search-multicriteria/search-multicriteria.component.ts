import { Component, EventEmitter, Output, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ValueChangeEvent } from "@angular/forms";

import { Slider } from "primeng/slider";
import { MultiSelect } from "primeng/multiselect";
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';


import { ButtonModule } from "primeng/button";
import { ScpiIndexModel, ScpiSearch } from "@/core/model/scpi.model";
import { ScpiService } from "@/core/service/scpi.service";
import { SearchBarComponent } from "@/features/search-multicriteria/components/search-bar/search-bar.component";
import { catchError } from "rxjs";
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: "app-search-multicriteria",
  standalone: true,
  imports: [
    CommonModule,
    OverlayBadgeModule,
    BadgeModule,
    FormsModule,
    SidebarModule,
    Slider,
    MultiSelect,
    ButtonModule,
    SearchBarComponent,
  ],
  templateUrl: "./search-multicriteria.component.html",
  styleUrls: ["./search-multicriteria.component.css"],
})
export class SearchMulticriteriaComponent {
  @Output() scpiFiltered = new EventEmitter<ScpiIndexModel[]>();
  isFilterVisible = false;
  noResultsMessage = false;
  @Output() noResultsMessageChange = new EventEmitter<boolean>();

  loading = false;
  scpiResults: ScpiIndexModel[] = [];

  filters: ScpiSearch = this.getDefaultFilters();

  sidebarVisible = true;
  constructor(private scpiService: ScpiService) {}

  onSearchTermChanged(searchTerm: string) {
    this.filters.name = searchTerm.trim();
    if (this.isSearchDisabled()) {
      this.resetFilters();
    } else {
      this.searchScpi();
    }
  }

  searchScpi() {
    this.isFilterVisible = false;
    let filtersToSend: ScpiSearch = this.prepareFilters();



    this.loading = true;
    this.scpiService.getScpiWithFilter(filtersToSend).subscribe({
      next: (data) => {
        this.scpiResults = data || [];
        this.loading = false;
        this.scpiFiltered.emit(this.scpiResults);


      this.noResultsMessage = this.scpiResults.length === 0;
      this.noResultsMessageChange.emit(this.noResultsMessage);
      },
      error: (error) => {
        this.scpiResults = [];
        this.loading = false;
        this.scpiFiltered.emit([]);
        this.noResultsMessage = true;
        console.error(`Erreur lors du chargement des SCPI. Status: ${error.status}`);
      }
    });
  }

  isSearchDisabled(): boolean {
    return !Object.values(this.filters).some(
      (value) =>
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === "number" && value > 0) ||
        (typeof value === "string" && value.trim() !== "") ||
        (typeof value === "boolean")
    );
  }


  resetFilters(event? :MouseEvent) {
    event && event.stopPropagation();
    this.filters = this.getDefaultFilters();
    this.loading = true;
    this.noResultsMessage = false;
    this.scpiService
                .getScpiWithFilter({})
                .pipe(
                  catchError((error) => {
                    this.loading = false;
                    return [];
                  })
                )
                .subscribe((data) => {
                  this.scpiResults = data || [];
                  this.scpiFiltered.emit(this.scpiResults);
                  this.loading = false;

                })

  }


  private prepareFilters(): ScpiSearch {
    return {
      name: this.filters.name?.trim() || undefined,
      distributionRate: this.filters.distributionRate || undefined,
      subscriptionFees:
        this.filters.subscriptionFees !== undefined
          ? this.filters.subscriptionFees
          : undefined,
      frequencyPayment: this.filters.frequencyPayment || undefined,
      locations: this.filters.locations || undefined,
      sectors: this.filters.sectors || undefined,
      minimumSubscription:
        this.filters.minimumSubscription || undefined,
    };
  }

  private getDefaultFilters(): ScpiSearch {
    return {
      name: undefined,
      locations: undefined,
      sectors: undefined,
      distributionRate: undefined,
      minimumSubscription: 0,
      subscriptionFees: undefined,
      frequencyPayment: undefined,
    };
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  set selectedLocations(values: any[]) {
    this.filters.locations = values.map((item) => item.value);
    this.onFiltersChanged();
  }

  set selectedSectors(values: any[]) {
    this.filters.sectors = values.map((item) => item.value);
    this.onFiltersChanged();
  }


  onFiltersChanged() {
    if (this.isSearchDisabled()) {
      this.resetFilters();
    }
  }

  onSubscriptionFeeChange(selectedValue: boolean) {

    if (this.filters.subscriptionFees === selectedValue) {
      this.filters.subscriptionFees = undefined;
    } else {
      this.filters.subscriptionFees = selectedValue;
    }
    this.onFiltersChanged();
  }


  onRentalFrequencyChange(selectedValue: string) {
    if (this.filters.frequencyPayment === selectedValue) {
      this.filters.frequencyPayment = undefined;
    } else {
      this.filters.frequencyPayment = selectedValue;
    }
    this.onFiltersChanged();
  }


  investmentZones = [
    { label: "Europe", value: "Europe" },
    { label: "Grande-Bretagne", value: "Grande-Bretagne" },
    { label: "Espagne", value: "Espagne" },
    { label: "Irlande", value: "Irlande" },
    { label: "Italie", value: "Italie" },
    { label: "Allemagne", value: "Allemagne" },
    { label: "Pays-Bas", value: "Pays-Bas" },
    { label: "France", value: "France" },
    { label: "Pologne", value: "Pologne" },
    { label: "Portugal", value: "Portugal" },
    { label: "Belgique", value: "Belgique" },
    { label: "Autres", value: "" },
  ];

  investmentSectors = [
    { label: "Santé", value: "Santé" },
    { label: "Commerces", value: "Commerces" },
    { label: "Hôtels", value: "Hôtels" },
    { label: "Bureaux", value: "Bureaux" },
    { label: "Logistique", value: "Logistique" },
    { label: "Résidentiel", value: "Résidentiel" },
    { label: "Locaux d'activité", value: "Locaux d'activité" },
    { label: "Transport", value: "Transport" },
    { label: "Autres", value: "" },
  ];

  subscriptionFeesOptions = [
    { label: "Avec frais de souscription", value: true },
    { label: "Sans frais de souscription", value: false },
  ];

  rentalFrequencyOptions = [
    { label: "Mensuelle", value: "Mensuelle" },
    { label: "Trimestrielle", value: "Trimestrielle" },
  ];
}
