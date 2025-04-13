import { ScpiIndexModel} from "@/core/model/scpi.model";
import { ScpiService } from "@/core/service/scpi.service";
import { SearchMulticriteriaComponent } from "@/features/search-multicriteria/search-multicriteria.component";
import { CommonModule } from "@angular/common";
import { SkeletonModule } from "primeng/skeleton";
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { catchError, of, Subscription } from "rxjs";
import { ScpiCardComponent } from "./components/scpi-card/scpi-card.component";
import { UserService } from "@/core/service/user.service";
import { ScpiInvestModalComponent } from "@/features/scpi/scpi-invest-modal/scpi-invest-modal.component";

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

  private subscriptions = new Subscription();

  constructor(
    private scpiService: ScpiService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      if (!user) return;

      this.loading = true;

      this.subscriptions.add(
        this.scpiService
          .getScpiWithFilter({})
          .pipe(
            catchError((error) => {
              this.loading = false;
              return of([]);
            })
          )
          .subscribe((data: ScpiIndexModel[]) => {
            this.scpis = data;
            this.filteredScpis = [...data];
            this.loading = false;
            this.cdRef.detectChanges();
          })
      );
    });
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

  openInvestirModal({
    mode,
    scpi,
  }: {
    mode: string;
    scpi: ScpiIndexModel;
  }) {
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
