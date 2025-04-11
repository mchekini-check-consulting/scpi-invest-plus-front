import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputNumberModule } from "primeng/inputnumber";
import { CardModule } from "primeng/card";
import { YearPickerCalendarComponent } from "./year-picker-calendar/year-picker-calendar.component";
import { TranslateModule } from "@ngx-translate/core";
import { InvestorService } from "@/core/service/investor.service";
import { MessageService } from "primeng/api";
import { SimulationService } from "@/core/service/simulation.service";
import { Router } from "@angular/router";
import { ScpiService } from "@/core/service/scpi.service";
import {
  formatDistributionRate,
  formatLocation,
  formatMinimum,
} from "@/shared/utils/scpiIndex.utils";
import { ScpiIndexModel, ScpiModel } from "@/core/model/scpi.model";

@Component({
  selector: "app-scpi-invest-modal",
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
  templateUrl: "./scpi-invest-modal.component.html",
  styleUrl: "./scpi-invest-modal.component.css",
})
export class ScpiInvestModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() scpi?: ScpiIndexModel;
  @Input() mode?: string;
  @Output() close = new EventEmitter<void>();
  @Input() addScpi?: boolean;

  investmentDuration?: number;
  investmentPercentage?: number;
  selectedPropertyType: string = "Pleine propriété";
  i: number = 0;
  propertyOptions = [
    { label: "Pleine propriété", value: "Pleine propriété" },
    { label: "Nue-propriétaire", value: "Nue-propriétaire" },
    { label: "Usufruit", value: "Usufruit" },
  ];

  estimatedMonthlyIncome: number = 0;

  investmentForm = new FormGroup({
    sharePrice: new FormControl({ value: this.sharePrice, disabled: true }, [
      Validators.required,
      Validators.min(100),
    ]),
    propertyType: new FormControl("Pleine propriété", Validators.required),
    shareCount: new FormControl(1, [Validators.required, Validators.min(1)]),
    investmentDuration: new FormControl<{
      year: number;
      percentage: number;
    } | null>(null),
    totalInvestment: new FormControl(
      {
        value: this.minimumSubscription ? +this.minimumSubscription : 0,
        disabled: true,
      },
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
    private scpiService: ScpiService,
    private router: Router
  ) {
    this.investmentForm.valueChanges.subscribe(() => {});
  }

  get sharePrice(): number {
    //return this.scpi?.statYear?.sharePrice || 0;
    console.log("scpi que je récupère___", this.scpi);

    return 67;
  }

  get location(): string {
    return formatLocation(this.scpi?.countryDominant);
  }

  get distributionRate(): string {
    return formatDistributionRate(this.scpi?.distributionRate);
  }

  get minimumSubscription(): string {
    return formatMinimum(this.scpi?.minimumSubscription);
  }



  ngOnInit() {
    this.investmentForm.controls["sharePrice"].valueChanges.subscribe(() => {
      this.calculateTotalInvestment();
    });

    this.investmentForm.valueChanges.subscribe(() => {
      this.updateEstimatedMonthlyIncome();
    });

    this.investmentForm.controls["shareCount"].valueChanges.subscribe(() => {
      this.calculateTotalInvestment();
    });

    this.investmentForm.controls["investmentDuration"].valueChanges.subscribe(
      () => {
        this.updateEstimatedMonthlyIncome();
        this.calculateTotalInvestment();
      }
    );

    this.investmentForm.controls["propertyType"].valueChanges.subscribe(() => {
      this.updateEstimatedMonthlyIncome();
      this.calculateTotalInvestment();
      console.log("La prop a changée")
    });

    this.investmentForm.controls["totalInvestment"].valueChanges.subscribe(
      () => {
        //this.calculateShareCount();
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


    if (this.selectedPropertyType === "Pleine propriété") {
      return (totalInvestment * (annualReturnRate / 100)) / 12;
    } else if (this.investmentPercentage) {
      return (
        (totalInvestment *
          (annualReturnRate / 100) *
          (this.investmentPercentage / 100))/12
      );
    } else {
      return 0;
    }
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

  confirmInvestmentOrSimulation() {
    if (!this.investmentForm.valid) {
      console.warn("Formulaire invalide, veuillez vérifier les champs.");
      return;
    }

    if (this.mode === "investir") {
      const investmentData = this.investmentForm.getRawValue();
      this.createInvestment(investmentData);
    } else if (this.mode === "simuler") {
      const investmentData = this.investmentForm.getRawValue();

      if (this.scpi?.id) {
        this.scpiService.getScpiById(this.scpi.id).subscribe((scpi) => {
          const scpiData = this.createScpiData(scpi, investmentData);
          const locations = scpi.locations ?? [];
          const sectors = scpi.sectors ?? [];

          if (this.addScpi === true) {
            this.simulationService
              .addScpiToSimulation(scpiData, locations, sectors)
              .subscribe((updatedSimulation) => {
                this.simulationService.calculateSimulationResults(
                  updatedSimulation
                );
              });
          } else {
            const simulationCreation = this.createSimulation(
              scpiData,
              investmentData
            );
            this.simulationService.calculateSimulationResults(
              simulationCreation
            );
          }

          this.router.navigate([`simulations/detailSimulation`]);
        });
      }
    }
    this.closeModal();
  }

  private createScpiData(scpi: any, investmentData: any): any {
    return {
      scpiId: this.scpi?.id ?? 0,
      scpiName: scpi.name ?? this.scpi?.name ?? "simulation",
      numberPart: investmentData.shareCount ?? 0,
      partPrice: this.sharePrice ?? 0,
      rising: investmentData.totalInvestment ?? 0,
      statYear: scpi.statYear?.distributionRate,
      duree: investmentData.investmentDuration?.year ?? 0,
      dureePercentage: investmentData.investmentDuration?.percentage ?? 0,
      propertyType: investmentData.propertyType ?? "",
      locations: scpi.locations ?? [],
      sectors: scpi.sectors ?? [],
    };
  }

  private createSimulation(scpiData: any, investmentData: any): any {
    return {
      id: -1,
      name: "Simulation",
      monthlyIncome: 0,
      totalInvestment: investmentData.totalInvestment ?? 0,
      simulationDate: new Date().toISOString().split("T")[0],
      scpiSimulations: [scpiData],
    };
  }

  private createInvestment(dataInvestment:any): any {
    if (this.investmentForm.valid) {
      const investmentData = {
        typeProperty: this.investmentForm.value.propertyType,
        numberShares: this.investmentForm.value.shareCount,
        numberYears: this.investmentForm.value.investmentDuration?.year || 0,
        totalAmount: dataInvestment.totalInvestment ?? 0,
        scpiId: this.scpi?.id,
        investmentState: "Investissement",
      };
      this.investorService.createInvestment(investmentData).subscribe({
        next: () => {
          this.messageService.add({
            severity: "info",
            summary: "Demande en cours",
            detail:
              "Votre demande d'investissement est en cours de traitement. Une décision vous sera envoyée par email dans les plus brefs délais.",
            life: 2000,
          });
        },
        error: () => {
          this.messageService.add({
            severity: "error",
            summary: "Erreur",
            detail: "Une erreur est survenue lors de l'investissement.",
          });
        },
      });
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "Attention",
        detail: "Veuillez compléter tous les champs obligatoires.",
      });
    }
  }

  calculateTotalInvestment() {
    const sharePrice = this.investmentForm.controls["sharePrice"].value || 0;
    let shareCount = this.investmentForm.controls["shareCount"].value || 0;

    if (sharePrice > 0 && shareCount > 0) {
      let total = sharePrice * shareCount;
      if (this.investmentPercentage && this.selectedPropertyType !== "Pleine propriété") {
        const percentage = this.investmentPercentage / 100;
        total = total * percentage;
      }

      let finalTotalInvestment = total;
      this.investmentForm.controls["totalInvestment"].setValue(
        finalTotalInvestment,
        {
          emitEvent: false,
        }
      );
      this.investmentForm.controls["shareCount"].setValue(shareCount, {
        emitEvent: false,
      });

      if (
        this.minimumSubscription &&
        shareCount * sharePrice < +this.minimumSubscription
      ) {
        this.investmentForm.controls["totalInvestment"].setErrors({
          belowMinimum: true,
        });
      } else {
        this.investmentForm.controls["totalInvestment"].setErrors(null);
      }
    }
  }

  calculateShareCount() {
    const totalInvestment =
      this.investmentForm.controls["totalInvestment"].value || 0;
    const sharePrice = this.investmentForm.controls["sharePrice"].value || 1;

    if (sharePrice > 0) {
      let shareCount = Math.floor(totalInvestment / sharePrice);

      if (totalInvestment % sharePrice !== 0) {
        shareCount += 1;
      }

      this.investmentForm.controls["shareCount"].setValue(shareCount, {
        emitEvent: false,
      });
    }
  }

  closeModal() {
    this.close.emit();
  }

  onYearSelected(event: { year: number; percentage: number }) {
    this.investmentForm.controls["investmentDuration"].setValue(event);
    this.investmentDuration = event.year;
    this.investmentPercentage = event.percentage;

    setTimeout(() => {
      this.updateEstimatedMonthlyIncome();
      this.calculateTotalInvestment();
    }, 0);
  }

  setSelectedPropertyType(propertyType: string) {
    this.selectedPropertyType = propertyType;

    if (this.selectedPropertyType === "Pleine propriété") {
      this.investmentDuration = 0;
      this.investmentPercentage = 0;
    }else if (this.selectedPropertyType ==="Usufruit"){
      this.investmentForm.controls['shareCount'].setValue(1);
      this.investmentDuration = 0;
      this.investmentPercentage = 0;
      this.investmentForm.controls["investmentDuration"].setValue(null);
    }else{
      this.investmentForm.controls['shareCount'].setValue(1);
      this.investmentDuration = 0;
      this.investmentPercentage = 0;
      this.investmentForm.controls["investmentDuration"].setValue(null);
    }
  }
}
