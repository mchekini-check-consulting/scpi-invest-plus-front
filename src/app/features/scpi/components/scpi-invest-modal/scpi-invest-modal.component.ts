import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {CardModule} from 'primeng/card';
import {YearPickerCalendarComponent} from './year-picker-calendar/year-picker-calendar.component';
import {TranslateModule} from '@ngx-translate/core';
import {InvestorService} from '@/core/service/investor.service';
import {MessageService} from 'primeng/api';
import {ScpiSimulation} from '@/core/model/Simulation';
import {SimulationService} from '@/core/service/simulation.service';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {SimulationActions} from '@/shared/store/simulation/action';

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
export class ScpiInvestModalComponent implements OnInit {
  @Input() scpiId?: number;
  @Input() scpiName?: string;
  @Input() visible: boolean = false;
  @Input() location?: string;
  @Input() distributionRate?: string;
  @Input() sharePrice?: number;
  @Input() minimumSubscription?: string;
  @Output() close = new EventEmitter<void>();

  @Input() simulationId?: number;
  @Input() mode: string = 'investir';

  investmentDuration?: number;
  investmentPercentage?: number;
  selectedPropertyType: string = 'Pleine propriété';

  propertyOptions = [
    {label: 'Pleine propriété', value: 'Pleine propriété'},
    {label: 'Nue-propriétaire', value: 'Nue-propriétaire'},
    {label: 'Usufruit', value: 'Usufruit'},
  ];

  estimatedMonthlyIncome: number = 0;
  investmentForm = new FormGroup({
    sharePrice: new FormControl({value: this.sharePrice, disabled: true}, [
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
    private router: Router,
    private store: Store
  ) {
    this.investmentForm.valueChanges.subscribe();
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
      this.investmentForm.patchValue({sharePrice: this.sharePrice});
    }
  }

  confirmInvestmentOrSimulation() {
    if (this.investmentForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez compléter tous les champs obligatoires.',
      });
      return
    }

    if (this.mode === 'simuler' && this.simulationId) {
      this.addScpiToSimulation()
    } else {
      this.createInvestment();
    }

    this.closeModal();
  }

  createInvestment(): void {
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
  }

  addScpiToSimulation(): void {
    let scpiSimulation: ScpiSimulation = {
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

    this.store.dispatch(SimulationActions.addSCPIToSimulation({scpiSimulation}));
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

  setSelectedPropertyType(propertyType: string) {
    this.selectedPropertyType = propertyType;
  }

}
