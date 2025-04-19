import { ScpiIndexModel } from "@/core/model/scpi.model";
import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ScpiCardComponent } from "../../scpi/components/scpi-card/scpi-card.component";
import { ScpiInvestModalComponent } from "@/features/scpi/scpi-invest-modal/scpi-invest-modal.component";

@Component({
  selector: "app-score-scpi",
  standalone: true,
  imports: [
    ScpiCardComponent,
    CommonModule,
    ScpiInvestModalComponent,
  ],
  templateUrl: "./scpi.score.component.html",
  styleUrl: "./scpi.score.component.css",
})
export class ScpiScoreComponent implements OnInit {
  @Input() isAddingScpi = false;
  @Input() addScpi?: boolean;
  @Input() scpis: ScpiIndexModel[] = [];

  selectedScpi?: ScpiIndexModel;
  investirModalVisible = false;
  modalMode: string = "investir";

  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);

  constructor() {}

  ngOnInit(): void {}

  getImage(id: number | string): string {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return "";
    return this.images[numericId % this.images.length];
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
}
