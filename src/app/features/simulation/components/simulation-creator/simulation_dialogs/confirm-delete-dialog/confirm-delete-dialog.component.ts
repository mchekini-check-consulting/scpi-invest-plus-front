import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: "app-confirm-delete-dialog",
  imports: [
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: "./confirm-delete-dialog.component.html",
  styleUrl: "./confirm-delete-dialog.component.css",
})
export class ConfirmDeleteDialogComponent {
  @Input() isVisible = false;
  @Input() message = "Voulez-vous vraiment supprimer la scpi ?";
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
