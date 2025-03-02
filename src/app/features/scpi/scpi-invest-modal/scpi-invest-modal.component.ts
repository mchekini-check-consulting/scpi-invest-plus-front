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
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule
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
  @Input() sharePrice?: number;
  @Input() minimumSubscription?: string;
  @Input() mode?: string;
  @Output() close = new EventEmitter<void>();



  investmentDuration?: number;
  investmentPercentage?: number;
  editable: boolean = false;

  currencyOptions: any[] = [];
  selectedPropertyType: string = '';

  propertyOptions = [
    { label: 'Pleine propriété', value: 'Pleine propriété' },
    { label: 'Nue-propriétaire', value: 'Nue-propriétaire' },
    { label: 'Usufruit', value: 'Usufruit' },
  ];

  investmentForm = new FormGroup({
    sharePrice: new FormControl({ value: this.sharePrice, disabled: true }, [
      Validators.required,
      Validators.min(100),
    ]),
    propertyType: new FormControl('Pleine propriété', Validators.required),
    shareCount: new FormControl(1, [Validators.required, Validators.min(1)]),
    investmentDuration: new FormControl<{
      year: number;
      percentage: number;
    } | null>(null),
    totalInvestment: new FormControl(
      +this.minimumSubscription! || 0,
      [
        Validators.required,
        Validators.min((+this.minimumSubscription! || 0) + 1),
      ]
    ),

  });

  constructor() {
    this.investmentForm.valueChanges.subscribe(() => {});
  }

  ngOnInit() {
    console.log('sharePrice reçu:', this.sharePrice);


    this.investmentForm.controls['sharePrice'].valueChanges.subscribe(() => {
      this.calculateTotalInvestment();
    });

    this.investmentForm.controls['shareCount'].valueChanges.subscribe(() => {
      this.calculateTotalInvestment();
    });

    this.investmentForm.controls['totalInvestment'].valueChanges.subscribe(() => {
      this.calculateShareCount();
    });

    if (this.sharePrice) {
      this.investmentForm.patchValue({ sharePrice: this.sharePrice });
    }
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

  calculateTotalInvestment() {
    const sharePrice = this.investmentForm.controls['sharePrice'].value || 0;
    let shareCount = this.investmentForm.controls['shareCount'].value || 0;

    if (sharePrice > 0 && shareCount > 0) {
      const totalInvestment = sharePrice * shareCount;
      const adjustedShareCount = Math.floor(totalInvestment / sharePrice);
      const remainder = totalInvestment % sharePrice;

      if (remainder === 0) {
        shareCount = adjustedShareCount;
      } else {
        shareCount = remainder < (sharePrice / 2) ? adjustedShareCount : adjustedShareCount + 1;
      }

      this.investmentForm.controls['totalInvestment'].setValue(shareCount * sharePrice, {
        emitEvent: false,
      });

      this.investmentForm.controls['shareCount'].setValue(shareCount, {
        emitEvent: false,
      });

      if (this.minimumSubscription && totalInvestment < +this.minimumSubscription) {
        this.investmentForm.controls['totalInvestment'].setErrors({
          belowMinimum: true,
        });
      } else {
        this.investmentForm.controls['totalInvestment'].setErrors(null);
      }
    }
  }

  calculateShareCount() {
    const totalInvestment = this.investmentForm.controls['totalInvestment'].value || 0;
    const sharePrice = this.investmentForm.controls['sharePrice'].value || 1;

    if (sharePrice > 0) {
      let shareCount = Math.floor(totalInvestment / sharePrice);

      if (totalInvestment % sharePrice !== 0) {
        shareCount += 1;
      }

      this.investmentForm.controls['shareCount'].setValue(shareCount, { emitEvent: false });
    }
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

  setEditableState() {
    if (this.editable) {
      this.investmentForm.controls['shareCount'].enable();
    } else {
      this.investmentForm.controls['shareCount'].disable();
    }
  }


  setSelectedPropertyType(propertyType: string) {
    this.selectedPropertyType = propertyType;

  }

}
