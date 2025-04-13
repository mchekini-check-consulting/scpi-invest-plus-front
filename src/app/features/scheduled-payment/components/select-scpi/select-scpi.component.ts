import { Component, EventEmitter, Output } from "@angular/core";
import { DecimalPipe, NgForOf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { catchError, of } from "rxjs";

import { Dialog } from "primeng/dialog";
import { Slider } from "primeng/slider";
import { Panel } from "primeng/panel";
import { PrimeTemplate } from "primeng/api";

import { ScpiCardComponent } from "@/features/scpi/components/scpi-card/scpi-card.component";
import { ScpiIndexModel, ScpiModel } from "@/core/model/scpi.model";
import { ScpiService } from "@/core/service/scpi.service";
import { InvestmentPayload } from "@/core/model/Investments";

@Component({
  selector: "app-select-scpi",
  standalone: true,
  imports: [
    Dialog,
    NgForOf,
    ScpiCardComponent,
    DecimalPipe,
    Slider,
    FormsModule,
    Panel,
    PrimeTemplate,
  ],
  templateUrl: "./select-scpi.component.html",
  styleUrl: "./select-scpi.component.css",
})
export class SelectScpiComponent {
  @Output() onClick = new EventEmitter<{ scpi: ScpiIndexModel }>();
  @Output() valuesChanged = new EventEmitter<Partial<InvestmentPayload>>();
  @Output() onInvest = new EventEmitter();

  scpis: ScpiIndexModel[] = [];
  selectedScpi: ScpiIndexModel | null = null;
  isDialogVisible = false;

  numberShares = 1;
  initialDeposit = 1;

  readonly images = Array.from(
    { length: 10 },
    (_, i) => `img/scpi/${i + 1}.webp`
  );

  constructor(private scpiService: ScpiService) {
    this.loadScpis();
  }

  private get sharePrice(): number {
    return this.selectedScpi?.sharePrice || 1;
  }

  private get minimumSubscription(): number {
    return this.selectedScpi?.minimumSubscription || 1;
  }

  private loadScpis(): void {
    this.scpiService
      .getScpisWithScheduledPayment()
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.scpis = data;
        if (data.length) {
          this.resetInvestmentValues(data[0]);
          this.onClick.emit({ scpi: data[0] });
        }
      });
  }

  private resetInvestmentValues(scpi: ScpiIndexModel): void {
    this.selectedScpi = scpi;
    this.numberShares = 1;
    this.initialDeposit = this.getMinDepositShare();

    this.valuesChanged.emit({
      numberShares: this.numberShares,
      initialDeposit: this.initialDeposit,
      scpiId: scpi.scpiId,
    });
  }

  onSelect(scpi: ScpiIndexModel): void {
    this.resetInvestmentValues(scpi);
    this.onClick.emit({ scpi });
    this.closeDialog();
  }

  onDepositChange(value?: number): void {
    if (!value) return;
    this.initialDeposit = value;
    this.valuesChanged.emit({ initialDeposit: value });
  }

  onShareChange(value?: number): void {
    if (!value) return;
    this.numberShares = value;
    this.valuesChanged.emit({ numberShares: value });
  }

  getMonthlyPayment(): number {
    return this.numberShares * this.sharePrice;
  }

  getInitialDeposit(): number {
    return this.initialDeposit * this.sharePrice;
  }

  getImage(id: number): string {
    return this.images[id % this.images.length];
  }

  getMaxMonthlyShareSteps(): number {
    return Math.floor(3000 / this.sharePrice);
  }

  getMinDepositShare(): number {
    return Math.floor(this.minimumSubscription / this.sharePrice);
  }

  getMaxDepositShare(): number {
    return Math.floor(30000 / this.sharePrice);
  }

  closeDialog(): void {
    this.isDialogVisible = false;
  }
}
