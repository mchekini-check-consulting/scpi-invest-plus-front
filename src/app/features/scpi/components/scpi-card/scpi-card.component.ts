import { ScpiModel } from "@/core/model/scpi.model";
import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { Tag } from "primeng/tag";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { TranslateModule } from "@ngx-translate/core";
import {
  formatDistributionRate,
  formatLocation,
  formatMinimum,
  formatSector,
} from "@/shared/utils/scpi.utils";

@Component({
  selector: "app-scpi-card",
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    DividerModule,
    Tag,
    CommonModule,
    RouterLink,
    DialogModule,
    ToastModule,
    TranslateModule,
  ],
  templateUrl: "./scpi-card.component.html",
  styleUrl: "./scpi-card.component.css",
})
export class ScpiCardComponent {
  @Input() scpi?: ScpiModel;
  @Input() image!: string;
  @Input() addScpi?: boolean;
  @Input() isAddingScpi = false;
  @Output() onClick = new EventEmitter<{ mode: string; scpi: ScpiModel }>();

  constructor() {}

  get location(): string {
    return formatLocation(this.scpi?.location);
  }

  get sector(): string {
    return formatSector(this.scpi?.sector);
  }

  get distributionRate(): string {
    return formatDistributionRate(this.scpi?.statYear);
  }

  get minimumSubscription(): string {
    return formatMinimum(this.scpi?.minimumSubscription);
  }

  openInvestirModal(mode: string) {
    if (this.scpi) {
      this.onClick.emit({ mode, scpi: this.scpi });
    }
  }
}
