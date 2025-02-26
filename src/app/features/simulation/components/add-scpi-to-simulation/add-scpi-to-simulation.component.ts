import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { AddScpiDialogComponent } from '../simulation-creator/simulation_dialogs/add-scpi-dialog/add-scpi-dialog.component';


@Component({
  selector: 'app-add-scpi-to-simulation',
  imports: [CardModule, ButtonModule,  DialogModule,AddScpiDialogComponent],
  templateUrl: './add-scpi-to-simulation.component.html',
  styleUrl: './add-scpi-to-simulation.component.css'
})
export class AddScpiToSimulationComponent {

  @Input() isAddScpiDialogVisible: boolean = false;
  @Output() closeDialog = new EventEmitter<void>();

  onClose() {
    this.closeDialog.emit();
  }

}
