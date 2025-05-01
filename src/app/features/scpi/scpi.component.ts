import { ScpiIndexModel } from "@/core/model/scpi.model";
import { ScpiService } from "@/core/service/scpi.service";
import { SearchMulticriteriaComponent } from "@/features/scpi/search-multicriteria/search-multicriteria.component";
import { CommonModule } from "@angular/common";
import { SkeletonModule } from "primeng/skeleton";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import {
  catchError,
  filter,
  of,
  Subscription,
  switchMap,
  take,
  tap,
} from "rxjs";
import { ScpiCardComponent } from "./components/scpi-card/scpi-card.component";
import { UserService } from "@/core/service/user.service";
import { ScpiInvestModalComponent } from "@/features/scpi/scpi-invest-modal/scpi-invest-modal.component";
import { UserModel } from "@/core/model/user.model";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-scpi",
  standalone: true,
  imports: [
    ScpiCardComponent,
    SearchMulticriteriaComponent,
    CommonModule,
    SkeletonModule,
    ScpiInvestModalComponent,
  ],
  templateUrl: "./scpi.component.html",
  styleUrl: "./scpi.component.css",
})
export class ScpiComponent implements OnInit, OnDestroy {
  @Input() isAddingScpi = false;
  @Input() addScpi?: boolean;

  scpis: ScpiIndexModel[] = [];
  filteredScpis: ScpiIndexModel[] = [];
  selectedScpi?: ScpiIndexModel;
  noResultsMessage = false;
  loading = false;

  skeletonArray = new Array(10);
  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);
  investirModalVisible = false;
  modalMode: string = "investir";

  scpiFilters = [
    'name',
    'locations',
    'sectors',
    'minimumSubscription',
    'frequencyPayment'
  ];


  private subscriptions = new Subscription();

  constructor(
    private scpiService: ScpiService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const activeQueryParams = this.route.snapshot.queryParams;
    const hasScpiFilters = this.scpiFilters.some(key => {
      const value = activeQueryParams[key];
      return value !== undefined && value !== '' && value !== null;
    });

    if (!hasScpiFilters) {
      this.userService.user$
        .pipe(
          filter((user): user is UserModel => !!user),
          take(1),
          tap(() => (this.loading = true)),
          switchMap(() =>
            this.scpiService.getScpiWithFilter({}).pipe(
              catchError(() => {
                this.loading = false;
                return of([]);
              })
            )
          )
        )
        .subscribe((data: ScpiIndexModel[]) => {
          this.scpis = data;
          this.filteredScpis = [...data];
          this.loading = false;
          this.cdRef.detectChanges();
        });
    }
  }


  getImage(id: number | string): string {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return "";
    return this.images[numericId % this.images.length];
  }

  updateScpiList(filteredList: ScpiIndexModel[] | null | undefined) {
    this.filteredScpis =
      filteredList && filteredList.length > 0 ? [...filteredList] : [];
    this.noResultsMessage = this.filteredScpis.length === 0;
    this.cdRef.detectChanges();
  }

  openInvestirModal({ mode, scpi }: { mode: string; scpi: ScpiIndexModel }) {
    this.modalMode = mode;
    this.selectedScpi = scpi;
    this.investirModalVisible = true;
  }

  closeInvestirModal() {
    this.investirModalVisible = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
