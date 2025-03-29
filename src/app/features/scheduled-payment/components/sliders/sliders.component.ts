import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Slider } from "primeng/slider";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-sliders",
  imports: [Slider, FormsModule],
  templateUrl: "./sliders.component.html",
  styleUrl: "./sliders.component.css",
})
export class SlidersComponent {
  @Input() minSubscription: number = 0;
  @Input() sharePrice: number = 0;
  @Output() valuesChanged = new EventEmitter<{
    numberShares: number;
  }>();

  numberShares: number = 1;
  initialDeposit: number = 0;

  onValueChange() {
    this.valuesChanged.emit({
      numberShares: this.numberShares,
    });
  }
}
