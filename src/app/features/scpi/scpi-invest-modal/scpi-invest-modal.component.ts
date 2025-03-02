import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { YearPickerCalendarComponent } from './year-picker-calendar/year-picker-calendar.component';

@Component({
  selector: 'app-scpi-invest-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputNumberModule,
    CardModule,
    YearPickerCalendarComponent,
  ],
  templateUrl: './scpi-invest-modal.component.html',
  styleUrl: './scpi-invest-modal.component.css',
})
export class ScpiInvestModalComponent {
  @Input() scpiId?: number;
  @Input() scpiName?: string;
  @Input() visible: boolean = false;
  @Input() location?: string;
  @Input() distributionRate?: string;
  @Input() minimumSubscription?: string;
  @Output() close = new EventEmitter<void>();

  investmentDuration?: number;
  investmentPercentage?: number;
  editable: boolean = false;

  currencyOptions: any[] = [];

  propertyOptions = [
    { label: 'Pleine propriété', value: 'Pleine propriété' },
    { label: 'Nue propriété', value: 'Nue propriété' },
    { label: 'Usufruit', value: 'Usufruit' },
  ];

  investmentForm = new FormGroup({
    sharePrice: new FormControl({ value: 1000, disabled: true }, [
      Validators.required,
      Validators.min(100),
    ]),
    propertyType: new FormControl('Pleine propriété', Validators.required),
    shareCount: new FormControl({ value: 1, disabled: true }, [
      Validators.required,
      Validators.min(1),
    ]),
    investmentDuration: new FormControl<{
      year: number;
      percentage: number;
    } | null>(null),
    totalInvestment: new FormControl(0, Validators.required),
  });

  constructor() {
    this.investmentForm.valueChanges.subscribe(() => {});
  }

  confirmInvestment() {
    if (this.investmentForm.valid) {
      console.log(
        `Investissement de ${this.investmentForm.value.totalInvestment}€ en ${this.investmentForm.value.propertyType}`
      );
      this.closeModal();
    } else {
      console.warn('Formulaire invalide, veuillez vérifier les champs.');
    }
  }

  updateYear(selectedYear: { year: number; percentage: number }) {
    this.investmentForm.patchValue({
      investmentDuration: selectedYear,
    });
    this.investmentDuration = selectedYear.year;
    this.investmentPercentage = selectedYear.percentage;
  }

  onYearSelected(event: { year: number; percentage: number }) {
    this.investmentForm.controls['investmentDuration'].setValue(event);
    this.investmentDuration = event.year;
    this.investmentPercentage = event.percentage;
  }

  closeModal() {
    this.close.emit();
  }

  disableFormControls(): void {
    Object.entries(this.investmentForm.controls).forEach(([field, control]) => {
      if (control.enabled) {
        control.disable();
      }
    });
  }

  toggleEdit(): void {
    this.editable = !this.editable;

    Object.entries(this.investmentForm.controls).forEach(([field, control]) => {
      if (field === 'shareCount') {
        control.disable();
      } else {
        this.editable ? control.enable() : control.disable();
      }
    });
  }
}
