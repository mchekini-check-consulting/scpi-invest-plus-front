import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ValueChangeEvent } from "@angular/forms";
import { Sidebar } from "primeng/sidebar";
import { Slider } from "primeng/slider";
import { MultiSelect } from "primeng/multiselect";
import { SelectButton } from "primeng/selectbutton";
import { ButtonModule } from "primeng/button";
import { ScpiSearch } from "@/core/model/scpi.model";
import { ScpiService } from "@/core/service/scpi.service";
import { ScpiModel } from "@/core/model/scpi.model";
import { SearchBarComponent } from "@/features/search-multicriteria/components/search-bar/search-bar.component";

@Component({
  selector: "app-search-multicriteria",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Sidebar,
    Slider,
    MultiSelect,
    SelectButton,
    ButtonModule,
    SearchBarComponent,
  ],
  templateUrl: "./search-multicriteria.component.html",
  styleUrls: ["./search-multicriteria.component.css"],
})
export class SearchMulticriteriaComponent {
  @Output() scpiFiltered = new EventEmitter<ScpiModel[]>();
  isFilterVisible = false;
  noResultsMessage = false;
  @Output() noResultsMessageChange = new EventEmitter<boolean>();
  loading = false;
  scpiResults: ScpiModel[] = [];

  filters: ScpiSearch = this.getDefaultFilters();

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
    if (this.isSearchDisabled()) {
      return;
    }

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


  resetFilters() {
    this.filters = this.getDefaultFilters();
    this.loading = true;
    this.noResultsMessage = false;
    this.scpiService.get().subscribe(
      (data) => {
        this.scpiResults = data || [];
        this.loading = false;
        // To DO à comprendre
        this.scpiFiltered.emit(this.scpiResults);
      },

      (error) => {
        this.scpiResults = [];
        this.loading = false;
        this.scpiFiltered.emit([]);
        console.error("Erreur lors du rechargement des SCPI", error.HttpErrorResponse.Headers);
      }
    );
  }

  
  private prepareFilters(): ScpiSearch {
    return {
      name: this.filters.name?.trim() || undefined,
      minimumDistribution: this.filters.minimumDistribution || undefined,
      subscriptionFees:
        this.filters.subscriptionFees !== undefined
          ? this.filters.subscriptionFees
          : undefined,
      frequencyPayment: this.filters.frequencyPayment || undefined,
      locations: this.filters.locations || undefined,
      sectors: this.filters.sectors || undefined,
      minimumInvestmentAmount:
        this.filters.minimumInvestmentAmount || undefined,
    };
  }

  private getDefaultFilters(): ScpiSearch {
    return {
      name: undefined,
      locations: undefined,
      sectors: undefined,
      minimumInvestmentAmount: 0,
      subscriptionFees: undefined,
      minimumDistribution: undefined,
      frequencyPayment: undefined,
    };
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  set selectedLocations(values: any[]) {
    this.filters.locations = values.map((item) => item.value);
  }

  set selectedSectors(values: any[]) {
    this.filters.sectors = values.map((item) => item.value);
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
    { label: "Avec frais", value: true },
    { label: "Sans frais", value: false },
  ];

  rentalFrequencyOptions = [
    { label: "Mensuelle", value: "Mensuelle" },
    { label: "Trimestrielle", value: "Trimestrielle" },
  ];
}
