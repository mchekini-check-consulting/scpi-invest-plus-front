import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Slider } from "primeng/slider";
import { MultiSelect } from "primeng/multiselect";
import { BadgeModule } from "primeng/badge";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { ScpiIndexModel, ScpiSearch } from "@/core/model/scpi.model";
import { ScpiService } from "@/core/service/scpi.service";
import { SearchBarComponent } from "@/features/scpi/search-multicriteria/components/search-bar/search-bar.component";
import { catchError } from "rxjs";
import { SidebarModule } from "primeng/sidebar";
import { TranslationHelperService } from "@/core/service/translation-helper.service";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-search-multicriteria",
  standalone: true,
  imports: [
    CommonModule,
    OverlayBadgeModule,
    BadgeModule,
    FormsModule,
    TranslateModule,
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
  investmentZones: any[] = [];
  investmentSectors: any[] = [];
  filters: ScpiSearch = this.getDefaultFilters();
  sidebarVisible = true;
  selectedLocationsInternal: any[] = [];
  selectedSectorsInternal: any[] = [];

  constructor(
    private scpiService: ScpiService,
    private translate: TranslateService,
    private translationHelper: TranslationHelperService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.translateOptions();
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe(() => {
      this.translateOptions();
    });

    this.route.queryParams.subscribe((params) => {
      this.filters.name = params['name'] || '';
      this.filters.distributionRate = params['distributionRate'] ? +params['distributionRate'] : undefined;
      this.filters.minimumSubscription = params['minimumSubscription'] ? +params['minimumSubscription'] : 0;
      this.filters.subscriptionFees = params['subscriptionFees'] === 'true' ? true : params['subscriptionFees'] === 'false' ? false : undefined;
      this.filters.frequencyPayment = params['frequencyPayment'] || undefined;

      this.filters.locations = params['locations'] ? params['locations'].split(',') : [];
      this.filters.sectors = params['sectors'] ? params['sectors'].split(',') : [];

      this.selectedLocationsInternal = this.investmentZones.filter(z => this.filters.locations?.includes(z.value));
      this.selectedSectorsInternal = this.investmentSectors.filter(s => this.filters.sectors?.includes(s.value));

      if (!this.isSearchDisabled()) {
        this.searchScpi();
      }
    });
  }


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

    this.updateQueryParams();


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
        console.error(
          `Erreur lors du chargement des SCPI. Status: ${error.status}`
        );
      },
    });
  }

  isSearchDisabled(): boolean {
    return !Object.values(this.filters).some(
      (value) =>
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === "number" && value > 0) ||
        (typeof value === "string" && value.trim() !== "") ||
        typeof value === "boolean"
    );
  }

  isNonNameFilterActive(): boolean {
    const { name, ...otherFilters } = this.filters;
    return Object.values(otherFilters).some(
      (value) =>
        (Array.isArray(value) && value.length > 0) ||
        (typeof value === "number" && value > 0) ||
        (typeof value === "string" && value.trim() !== "") ||
        typeof value === "boolean"
    );
  }

  resetFilters(event?: MouseEvent) {
    event && event.stopPropagation();
    this.filters = this.getDefaultFilters();
    this.loading = true;
    this.selectedLocationsInternal = [];
    this.selectedSectorsInternal = [];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
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
      });
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
      minimumSubscription: this.filters.minimumSubscription || undefined,
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



  get selectedLocations() {
    return this.selectedLocationsInternal;
  }
  set selectedLocations(values: any[]) {
    this.selectedLocationsInternal = values;
    this.filters.locations = values.map((item) => item.value);
    this.onFiltersChanged();
  }

  get selectedSectors() {
    return this.selectedSectorsInternal;
  }
  set selectedSectors(values: any[]) {
    this.selectedSectorsInternal = values;
    this.filters.sectors = values.map((item) => item.value);
    this.onFiltersChanged();
  }

  onFiltersChanged() {
    if (this.isSearchDisabled()) {
      this.resetFilters();
    }
  }

  private updateQueryParams() {
    const queryParams: any = {
      ...this.filters,
      locations: this.filters.locations?.join(','),
      sectors: this.filters.sectors?.join(','),
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
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

  subscriptionFeesOptions = [
    { label: "FILTER.SUBSCRIPTION_FEES_WITH", value: true },
    { label: "FILTER.SUBSCRIPTION_FEES_WITHOUT", value: false },
  ];

  rentalFrequencyOptions = [
    { label: "FILTER.RENTAL_FREQUENCY_MONTHLY", value: "Mensuelle" },
    { label: "FILTER.RENTAL_FREQUENCY_QUARTERLY", value: "Trimestrielle" },
  ];

  private translateOptions() {
    this.translationHelper.loadInvestmentZonesAndSectors().subscribe(({ zones, sectors }) => {
      this.investmentZones = zones;
      this.investmentSectors = sectors;
    });
  }
}
