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
import { InvestorService } from '@/core/service/investor.service';
import { MessageService } from 'primeng/api';
import { ScpiSimulation } from '@/core/model/Simulation';
import { SimulationService } from '@/core/service/simulation.service';
import { Router } from '@angular/router';

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
    TranslateModule,
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
  @Input() simulationId?: number;

  investmentDuration?: number;
  investmentPercentage?: number;
  editable: boolean = false;
  currencyOptions: any[] = [];
  selectedPropertyType: string = 'Pleine propriété';

  propertyOptions = [
    { label: 'Pleine propriété', value: 'Pleine propriété' },
    { label: 'Nue-propriétaire', value: 'Nue-propriétaire' },
    { label: 'Usufruit', value: 'Usufruit' },
  ];

  estimatedMonthlyIncome: number = 0;
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
      this.minimumSubscription ? +this.minimumSubscription : null,
      [
        Validators.required,
        Validators.min(
          this.minimumSubscription ? +this.minimumSubscription : 1
        ),
      ]
    ),
  });

  constructor(
    private investorService: InvestorService,
    private messageService: MessageService,
    private simulationService: SimulationService,
    private router: Router
  ) {
    this.investmentForm.valueChanges.subscribe(() => {});
  }

  ngOnInit() {
    this.investmentForm.controls['sharePrice'].valueChanges.subscribe(() => {
      this.calculateTotalInvestment();
    });

    this.investmentForm.valueChanges.subscribe(() => {
      this.updateEstimatedMonthlyIncome();
    });

    this.investmentForm.controls['shareCount'].valueChanges.subscribe(() => {
      this.calculateTotalInvestment();
    });

    this.investmentForm.controls['totalInvestment'].valueChanges.subscribe(
      () => {
        this.calculateShareCount();
      }
    );

    if (this.sharePrice) {
      this.investmentForm.patchValue({ sharePrice: this.sharePrice });
    }
  }

  calculateEstimatedMonthlyIncome(
    totalInvestment: number,
    annualReturnRate: number
  ): number {
    return (totalInvestment * (annualReturnRate / 100)) / 12;
  }

  updateEstimatedMonthlyIncome() {
    const totalInvestment =
      this.investmentForm.getRawValue().totalInvestment || 0;
    const rateMatch = this.distributionRate?.match(/([\d.]+)%?/);
    const annualReturnRate = rateMatch ? parseFloat(rateMatch[1]) : 0;
    this.estimatedMonthlyIncome = this.calculateEstimatedMonthlyIncome(
      totalInvestment,
      annualReturnRate
    );
  }

  minimumInvestmentValidator(control: FormControl) {
    if (this.minimumSubscription && control.value < +this.minimumSubscription) {
      return { belowMinimum: true };
    }
    return null;
  }

  confirmInvestmentOrSimulation() {
    if (this.investmentForm.valid) {
      if (this.mode === 'investir') {
        this.createInvestment();
      } else if (
        this.mode === 'simuler' &&
        String(this.simulationId) !== '-1'
      ) {
        let simulationScpi: ScpiSimulation = {
          scpiId: this.scpiId ?? 0,
          simulationId: this.simulationId ?? 0,
          numberPart: this.investmentForm.getRawValue().shareCount ?? 0,
          partPrice: this.sharePrice ?? 0,
          rising: this.investmentForm.getRawValue().totalInvestment ?? 0,
          duree:
            this.investmentForm.getRawValue().investmentDuration?.year ?? null,
          dureePercentage:
            this.investmentForm.getRawValue().investmentDuration?.percentage ??
            null,
          propertyType: this.selectedPropertyType ?? '',
        };

        this.simulationService.addScpiToSimulation(simulationScpi).subscribe({
          next: (response) => {
            this.router.navigate([`/simulations/details/${this.simulationId}`]);
            this.closeModal();
          },
          error: (error) => {
            console.error('Erreur lors de l’ajout de la simulation', error);
          },
        });
      }
      this.closeModal();
    } else {
      console.warn('Formulaire invalide, veuillez vérifier les champs.');
    }
  }

  createInvestment(): void {
    if (this.investmentForm.valid) {
      const investmentData = {
        typeProperty: this.investmentForm.value.propertyType,
        numberShares: this.investmentForm.value.shareCount,
        numberYears: this.investmentForm.value.investmentDuration?.year || 0,
        totalAmount: this.investmentForm.value.totalInvestment,
        scpiId: this.scpiId,
        investmentState: 'Investissement',
      };

      this.investorService.createInvestment(investmentData).subscribe(
        () => {
          const toastDuration = 2000;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Investissement réalisé avec succès.',
            life: toastDuration,
          });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: "Une erreur est survenue lors de l'investissement.",
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez compléter tous les champs obligatoires.',
      });
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
        shareCount =
          remainder < sharePrice / 2
            ? adjustedShareCount
            : adjustedShareCount + 1;
      }

      this.investmentForm.controls['totalInvestment'].setValue(
        shareCount * sharePrice,
        {
          emitEvent: false,
        }
      );

      this.investmentForm.controls['shareCount'].setValue(shareCount, {
        emitEvent: false,
      });

      if (
        this.minimumSubscription &&
        totalInvestment < +this.minimumSubscription
      ) {
        console.log('Erreur belowMinimum ajoutée');
        this.investmentForm.controls['totalInvestment'].setErrors({
          belowMinimum: true,
        });
      } else {
        console.log('Erreur belowMinimum supprimée');
        this.investmentForm.controls['totalInvestment'].setErrors(null);
      }
    }
  }

  calculateShareCount() {
    const totalInvestment =
      this.investmentForm.controls['totalInvestment'].value || 0;
    const sharePrice = this.investmentForm.controls['sharePrice'].value || 1;

    if (sharePrice > 0) {
      let shareCount = Math.floor(totalInvestment / sharePrice);

      if (totalInvestment % sharePrice !== 0) {
        shareCount += 1;
      }

      this.investmentForm.controls['shareCount'].setValue(shareCount, {
        emitEvent: false,
      });
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
