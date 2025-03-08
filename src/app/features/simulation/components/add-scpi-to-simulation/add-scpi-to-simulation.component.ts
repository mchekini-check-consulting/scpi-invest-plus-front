import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import {
  AddScpiDialogComponent
} from '../simulation-creator/simulation_dialogs/add-scpi-dialog/add-scpi-dialog.component';
import {Simulation} from '@/core/model/Simulation';
import {DecimalPipe} from '@angular/common';


@Component({
  selector: 'app-add-scpi-to-simulation',
  imports: [CardModule, ButtonModule, DialogModule, AddScpiDialogComponent, DecimalPipe],
  templateUrl: './add-scpi-to-simulation.component.html',
  standalone: true,
  styleUrl: './add-scpi-to-simulation.component.css'
})
export class AddScpiToSimulationComponent {
  @Input() simulation?: Simulation;
  @Input() isAddScpiDialogVisible: boolean = false;
  @Input() simulationId? : number;
  @Output() closeDialog = new EventEmitter<void>();

  onClose() {
    this.closeDialog.emit();
  }


}
