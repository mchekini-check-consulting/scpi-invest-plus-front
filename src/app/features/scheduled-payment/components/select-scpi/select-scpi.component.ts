import { Component } from "@angular/core";
import { Dialog } from "primeng/dialog";
import { NgForOf } from "@angular/common";
import { ScpiCardComponent } from "@/features/scpi/components/scpi-card/scpi-card.component";
import { ScpiModel } from "@/core/model/scpi.model";
import { ScpiService } from "@/core/service/scpi.service";
import { catchError } from "rxjs";

@Component({
  selector: "app-select-scpi",
  imports: [Dialog, NgForOf, ScpiCardComponent],
  templateUrl: "./select-scpi.component.html",
  styleUrl: "./select-scpi.component.css",
})
export class SelectScpiComponent {
  scpis: ScpiModel[] = [];
  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);
  isDialogVisible: boolean = false;

  constructor(private scpiService: ScpiService) {
    this.scpiService
      .getScpisWithScheduledPayment()
      .pipe(
        catchError((error) => {
          return [];
        })
      )
      .subscribe((data) => {
        this.scpis = data;
      });
  }

  getImage(id: number): string {
    return this.images[id % this.images.length];
  }

  close() {
    this.isDialogVisible = false;
  }
}
