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

  monthlyAmount: number = 0;
  initialDeposit: number = 0;

  @Output() valuesChanged = new EventEmitter<{
    monthlyAmount: number;
    initialDeposit: number;
  }>();

  onValueChange() {
    this.valuesChanged.emit({
      monthlyAmount: this.monthlyAmount,
      initialDeposit: this.initialDeposit,
    });
  }
}
