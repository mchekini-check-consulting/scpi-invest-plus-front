import { ScpiModel } from "@/core/model/scpi.model";
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
import { catchError, Subscription } from "rxjs";
import { ScpiCardComponent } from "./components/scpi-card/scpi-card.component";
import { UserService } from "@/core/service/user.service";
import { ScpiInvestModalComponent } from "@/features/scpi/scpi-invest-modal/scpi-invest-modal.component";

@Component({
  selector: "app-scpi",
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
  scpis: ScpiModel[] = [];
  selectedScpi: ScpiModel | null = null;
  filteredScpis: ScpiModel[] = [];
  loading = false;
  skeletonArray = new Array(10);
  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);
  investirModalVisible: boolean = false;
  modalMode: string = "investir";
  private subscriptions: Subscription = new Subscription();

  constructor(
    private scpiService: ScpiService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      if (!user) {
        return;
      }

      if (this.filteredScpis.length === 0) {
        this.loading = true;
        this.subscriptions.add(
          this.scpiService
            .get()
            .pipe(
              catchError((error) => {
                this.loading = false;
                return [];
              })
            )
            .subscribe((data) => {
              this.scpis = data;
              this.filteredScpis = [...data];
              this.loading = false;
              this.cdRef.detectChanges();
            })
        );
      }
    });
  }

  getImage(id: number): string {
    return this.images[id % this.images.length];
  }

  updateScpiList(filteredList: ScpiModel[] | null | undefined) {
    if (filteredList && filteredList.length > 0) {
      this.filteredScpis = [...filteredList];
    } else {
      this.filteredScpis = [];
    }
    this.cdRef.detectChanges();
  }

  openInvestirModal({ mode, scpi }: { mode: string; scpi: ScpiModel }) {
    this.modalMode = mode;
    this.selectedScpi = scpi;
    this.investirModalVisible = true;
  }

  closeInvestirModal() {
    this.investirModalVisible = false;
    this.selectedScpi = null;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
