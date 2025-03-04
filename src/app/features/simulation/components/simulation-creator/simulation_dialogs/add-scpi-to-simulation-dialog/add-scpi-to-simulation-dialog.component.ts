import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-add-scpi-to-simulation-dialog',
  standalone: true,
  imports: [CardModule, ButtonModule, DialogModule, InputNumberModule, DropdownModule, FormsModule, SelectModule],
  templateUrl: './add-scpi-to-simulation-dialog.component.html',
  styleUrls: ['./add-scpi-to-simulation-dialog.component.css'],
})
export class AddScpiToSimulationDialogComponent {
  @Input() visibleAddScpiToSimulation: boolean = false;
  @Output() closeDialogAddScpiToSimulation = new EventEmitter<boolean>();

  propertyType: string = 'Pleine propriété';
  duration: string = '';
  numParts: number = 0;
  totalAmount: number = 0;
  estimatedMonthlyIncome: number = 0;

  propertyTypes: { label: string, value: string }[] = [
    { label: 'Pleine propriété', value: 'pleinePropriete' },
    { label: 'Nue propriété', value: 'nuePropriete' },
  ];

  durations: { label: string, value: string }[] = [
    { label: '1 an', value: '1an' },
    { label: '5 ans', value: '5ans' },
    { label: '10 ans', value: '10ans' },
  ];

  pricePerShare: number = 100;

  close() {
    this.closeDialogAddScpiToSimulation.emit(false);
  }

  onPropertyTypeChange() {
    if (this.propertyType === 'Pleine propriété') {
      this.duration = '';  
    }
  }

  calculateTotalAmount() {
    this.totalAmount = this.numParts * this.pricePerShare;
    this.calculateMonthlyIncome();
  }

  calculateMonthlyIncome() {
    const annualYieldRate = 0.05; 
    this.estimatedMonthlyIncome = (this.totalAmount * annualYieldRate) / 12;
  }

  addScpiToSimulation() {
    this.close();
  }
}
