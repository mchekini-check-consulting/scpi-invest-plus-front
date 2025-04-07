import { ScpiIndexModel, ScpiModel } from "@/core/model/scpi.model";
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
} from "@/shared/utils/scpiIndex.utils";

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
  styleUrls: ["./scpi-card.component.css"],
})
export class ScpiCardComponent {
  @Input() scpi?: ScpiIndexModel | ScpiModel;
  @Input() image!: string;
  @Input() addScpi?: boolean;
  @Input() isAddingScpi = false;
  @Output() onClick = new EventEmitter<{ mode: string; scpiId: number | string | undefined }>();

  constructor() {}


  get location(): string {
    if (this.scpi && 'countryDominant' in this.scpi) {
      return formatLocation(this.scpi.countryDominant);
    }
    return "N/A";
  }

  get sector(): string {
    if (this.scpi && 'dominantSector' in this.scpi) {
      return formatSector(this.scpi.dominantSector);
    }
    return "N/A";
  }

  get distributionRate(): string {
    if (this.scpi && 'distributionRate' in this.scpi) {
      return formatDistributionRate(this.scpi.distributionRate);
    }
    return "N/A";
  }

  get minimumSubscription(): string {
    if (this.scpi && 'minimumSubscription' in this.scpi) {
      return formatMinimum(this.scpi.minimumSubscription);
    }
    return "N/A";
  }

  openInvestirModal(mode: string, scpiId: number | string | undefined) {
  
    if (scpiId) {
      this.onClick.emit({ mode, scpiId });
    }
  }
}
