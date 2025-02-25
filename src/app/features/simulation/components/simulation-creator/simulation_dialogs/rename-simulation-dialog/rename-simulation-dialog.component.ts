import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-rename-simulation-dialog',
  imports: [
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './rename-simulation-dialog.component.html',
  styleUrl: './rename-simulation-dialog.component.css',
})
export class RenameSimulationDialogComponent {

  @Input() isDialogVisible: boolean = false;
  @Input() simulationName: string = '';
  @Output() closeDialog = new EventEmitter<void>();
  @Output() renameSimulation = new EventEmitter<string>();

  newSimulationName: string = '';
  ngOnInit() {
    this.newSimulationName = this.simulationName;
  }


  onDialogHide() {
    this.closeDialog.emit();
  }

  saveSimulationName() {
    this.renameSimulation.emit(this.newSimulationName);
    this.closeDialog.emit();
  }
}
