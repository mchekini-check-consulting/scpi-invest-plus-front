import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CardModule } from "primeng/card";
import { Investments } from "@/core/model/Investments";
import { InvestmentService } from "@/core/service/InvestmentService";
import { ScpiService } from "@/core/service/scpi.service";
import { ScpiModel } from "@/core/model/scpi.model";
import { Dismemberment } from "@/core/model/Dismemberment";
import { InvestorService } from "@/core/service/investor.service";
import { forkJoin } from "rxjs";
import dayjs from "dayjs";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [CardModule],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.css",
})
export class CardComponent {
  @Input() title: string = "";
  @Input() value: string = "";
  @Input() subtitle: string = "";
  scpiList: ScpiModel[] = [];
  dismembermentRates: Dismemberment[] = [];
  investissements: Investments[] = [];
  totalInvested: number = 0;
  rendementMoyen: number = 0;
  revenuMensuel: number = 0;
  cashback: number = 0;
  totalCashback: number = 0;
  totalInvesti: number = 0;
  nuePropRef: Dismemberment[] = [];
  usuFruitRef: Dismemberment[] = [];
  geographicalDistribution: { country: string; amount: number }[] = [];
  @Output() geographicalData = new EventEmitter<
    { country: string; amount: number }[]
  >();
  @Output() sectorialData = new EventEmitter<any>();

  constructor(
    private investmentService: InvestmentService,
    private scpiService: ScpiService,
    private investorService: InvestorService
  ) {}

  ngOnInit(): void {
    this.getInvestments();
    this.getScpiList();
    this.getDismembermentRates();
  }

  ngDoCheck(): void {
    const revenuMensuel = this.calculateStats({
      investments: this.investissements,
      scpis: this.scpiList,
      nuePropRef: this.nuePropRef,
      usuFruitRef: this.usuFruitRef,
    });

    this.revenuMensuel = revenuMensuel;
  }

  public getInvestments(): void {
    this.investmentService.getInvestments("VALIDATED").subscribe(
      (response) => {
        this.investissements = Array.isArray(response) ? response : [];
        this.totalInvested = 0;

        if (this.investissements.length > 0) {
          this.investissements.forEach((investment) => {
            this.totalInvested += investment.totalAmount;
          });
        }
      },
      (error) => {
        console.error(
          "Erreur lors de la récupération des investissements :",
          error
        );
      }
    );
  }

  public getScpiList(): void {
    this.scpiService.get().subscribe(
      (response : any) => {
        this.scpiList = Array.isArray(response) ? response : [];
        this.rendementMoyen = this.calculerRendementMoyen();
        this.calculateGeographicalDistribution();
        this.calculateSectorialDistribution();
        this.calculerCashback();
      },
      (error : any) => {
        console.error("Erreur lors de la récupération des SCPI :", error);
      }
    );
  }

  public calculerRendementMoyen(): number {
    const scpiMap = new Map(this.scpiList.map((scpi) => [scpi.name, scpi]));

    const tauxDistribution: number[] = this.investissements
      .map((inv) => {
        const scpi = scpiMap.get(inv.scpiName);
        if (!scpi) {
          console.warn(
            ` Aucune correspondance trouvée pour SCPI : ${inv.scpiName}`
          );
          return undefined;
        }

        return scpi.statYear?.distributionRate;
      })
      .filter((rate) => rate !== null) as number[];

    const rendementMoyen =
      tauxDistribution.reduce((acc, rate) => acc + rate, 0) /
      tauxDistribution.length;
    return parseFloat(rendementMoyen.toFixed(2));
  }

  private getDismembermentRates(): void {
    forkJoin({
      nueProprietaires:
        this.investorService.getDismembermentByType("Nue-propriétaire"),
      usufruitiers: this.investorService.getDismembermentByType("Usufruit"),
    }).subscribe({
      next: ({ nueProprietaires, usufruitiers }) => {
        this.nuePropRef = nueProprietaires || [];
        this.usuFruitRef = usufruitiers || [];
      },
      error: (error) =>
        console.error(
          "Erreur lors de la récupération des taux de démembrement:",
          error
        ),
    });
  }

  calculateStats({
    investments,
    scpis,
    usuFruitRef,
    nuePropRef,
  }: ICalculateStats): number {
    let revenuMensuel = 0;

    investments.forEach((inv) => {
      const scpi = scpis.find((sc: any) => sc.name === inv.scpiName);

      if (!scpi) return;

      if (inv.typeProperty === "PLEINE_PROPRIETE") {
        revenuMensuel +=
          (inv.numberShares *
            scpi.statYear.sharePrice *
            scpi.statYear.distributionRate) /
          12;
      }

      if (inv.typeProperty === "NUE_PROPRIETE") {
        const yearDiff = dayjs().diff(dayjs(inv.createdAt), "year");

        if (yearDiff <= inv.numberYears) return;

        const nuePropiete = nuePropRef.find(
          (row) => row.yearDismemberment === inv.numberYears
        );

        if (!nuePropiete) return;

        revenuMensuel +=
          (inv.numberShares *
            ((scpi.statYear.sharePrice * 100) / nuePropiete.rateDismemberment) *
            scpi.statYear.distributionRate) /
          12;
      }

      if (inv.typeProperty === "USUFRUIT") {
        const yearDiff = dayjs().diff(dayjs(inv.createdAt), "year");

        if (yearDiff > inv.numberYears) return;

        const usuFruit = usuFruitRef?.find(
          (row) => row.yearDismemberment === inv.numberYears
        );

        if (!usuFruit) return;

        revenuMensuel +=
          (inv.numberShares *
            ((scpi.statYear.sharePrice * 100) / usuFruit.rateDismemberment) *
            scpi.statYear.distributionRate) /
          12;
      }
    });

    return Math.ceil(revenuMensuel);
  }

  public calculerCashback(): void {
    const scpiMap = new Map(this.scpiList.map((scpi) => [scpi.name, scpi]));

    this.investissements.map((inv) => {
      const scpi = scpiMap.get(inv.scpiName);

      if (!scpi) return;

      const cashbackPourcent = scpi.cashback || 0;
      const cashback = (inv.totalAmount * cashbackPourcent) / 100;

      this.totalInvesti += inv.totalAmount;
      this.totalCashback += cashback;
    });

    this.cashback = parseFloat(
      (this.totalInvesti > 0
        ? (this.totalCashback / this.totalInvesti) * 100
        : 0
      ).toFixed(2)
    );
  }

  public calculateGeographicalDistribution(): void {
    if (this.investissements.length === 0 || this.scpiList.length === 0) return;

    const scpiMap = new Map(this.scpiList.map((scpi) => [scpi.name, scpi]));
    const countryDistribution = new Map<string, number>();
    let totalInvested = 0;

    this.investissements.forEach((inv) => {
      const scpi = scpiMap.get(inv.scpiName);
      if (!scpi || !scpi.location) return;

      const loc = scpi.location;
      const country = loc.id.country;
      const percentage = loc.countryPercentage / 100;
      const investedAmount = inv.totalAmount * percentage;

      countryDistribution.set(
        country,
        (countryDistribution.get(country) || 0) + investedAmount
      );

      totalInvested += investedAmount;
    });

    this.geographicalDistribution = Array.from(
      countryDistribution,
      ([country, amount]) => ({
        country,
        amount:
          totalInvested > 0
            ? parseFloat(((amount / totalInvested) * 100).toFixed(2))
            : 0,
      })
    );

    this.geographicalData.emit(this.geographicalDistribution);
  }

  calculateSectorialDistribution(): void {
    const sectorDistribution = new Map<string, number>();

    if (this.investissements.length === 0 || this.scpiList.length === 0) {
      return;
    }

    const scpiMap = new Map(this.scpiList.map((scpi) => [scpi.name, scpi]));

    let totalInvested = 0;

    this.investissements.forEach((inv) => {
      const scpi = scpiMap.get(inv.scpiName);

      if (scpi && scpi.sector) {
        const sectorName = scpi.sector.id.name;
        const sectorPercentage = scpi.sector.sectorPercentage / 100;
        const investedAmount = inv.totalAmount * sectorPercentage;

        sectorDistribution.set(
          sectorName,
          (sectorDistribution.get(sectorName) || 0) + investedAmount
        );

        totalInvested += investedAmount;
      }
    });

    const sectorData = Array.from(sectorDistribution, ([sector, amount]) => ({
      sector,
      amount:
        totalInvested > 0
          ? parseFloat(((amount / totalInvested) * 100).toFixed(2))
          : 0,
    }));

    sectorData.map((item) => ({
      sector: item.sector,
      amount: `${item.amount}%`,
    }));

    const labels = sectorData.map((data) => data.sector);
    const data = sectorData.map((data) => data.amount);
    const backgroundColors = ["#025222", "#10557d", "#3357FF"];

    this.sectorialData.emit({
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColors,
        },
      ],
    });
  }
}

interface ICalculateStats {
  investments: Investments[];
  scpis: ScpiModel[];
  usuFruitRef: Dismemberment[];
  nuePropRef: Dismemberment[];
}
