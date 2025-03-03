import { ScpiComponent } from '@/features/scpi/scpi.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-add-scpi-dialog',
  standalone: true,
  imports: [DialogModule, ScpiComponent],
  templateUrl: './add-scpi-dialog.component.html',
  styleUrl: './add-scpi-dialog.component.css',
})
export class AddScpiDialogComponent {
  @Input() isDialogVisible: boolean = false;
  @Input() simulationId? : number;
  @Output() closeDialog = new EventEmitter<void>();

  close() {
    this.closeDialog.emit();
  }
}
