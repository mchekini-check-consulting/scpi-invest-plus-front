import { Component, OnInit } from "@angular/core";
import { InvestmentService } from "@/core/service/InvestmentService";
import {
  Investments,
  InvestmentStatistics,
  InvestmentState,
} from "@/core/model/Investments";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { InvestmentsComponent } from "./investments/investments.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { ButtonModule } from "primeng/button";
import dayjs from "dayjs";
import { LocationId } from "@/core/model/Location";
import { SectorId } from "@/core/model/Sector";
import { Sector } from "@/core/model/Sector";
import { StatYear, YearStat } from "@/core/model/StatYear";

@Component({
  selector: "app-portefeuille",
  standalone: true,
  imports: [
    CommonModule,
    InvestmentsComponent,
    StatisticsComponent,
    ButtonModule,
  ],
  templateUrl: "./portefeuille.component.html",
  styleUrl: "./portefeuille.component.css",
})
export class PortefeuilleComponent implements OnInit {
  totalInvesti: number = 0;
  noResults: boolean = false;
  noData: boolean = false;
  investments: Investments[] = [];
  groupedInvestments: Investments[] = [];
  statistics?: InvestmentStatistics;
  error: string = "";
  totalRecords: number = 0;
  params: any = { currentPage: 0, pageSize: 10, selectedState: "VALIDATED" };
  statisticsLoaded: boolean = false;
  repGeographique: { id: LocationId; countryPercentage: number }[] = [];
  repSectoriel: Sector[] = [];
  distributionHistory: StatYear[] = [];
  chartData: any;

  constructor(
    private investmentService: InvestmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInvestments();
  }

  loadStatistics(): void {
    this.investmentService.getStatisticsInvestments().subscribe({
      next: (stats: InvestmentStatistics) => {
        this.statistics = stats;
        this.repGeographique = Object.entries(stats.repGeographique ?? {}).map(
          ([country, pourcentage], index) => {
            const locationId = {
              scpiId: index,
              country,
            };
            return {
              id: locationId,
              countryPercentage: pourcentage,
            };
          }
        );
        this.repSectoriel = Object.entries(stats.repSectoriel ?? {}).map(
          ([sector, pourcentage], index) => {
            const sectorId = new SectorId(index, sector);
            return new Sector(sectorId, pourcentage);
          }
        );

        this.distributionHistory = Object.entries(
          stats.distributionHistory ?? {}
        ).map(([yearStr, distributionRate], index) => {
          const year = Number(yearStr);
          const yearId = new YearStat(year, index);
          return new StatYear(yearId, distributionRate, 0, 0);
        });
        this.noData =
          this.repGeographique.length === 0 &&
          this.repSectoriel.length === 0 &&
          this.distributionHistory.length === 0;
      },

      error: () => {
        this.error = "Erreur lors du chargement des statistiques.";
      },
    });
  }
  loadInvestments(): void {
    this.groupedInvestments = [];
    this.error = "";
    const { currentPage, pageSize, selectedState } = this.params;

    this.investmentService
      .getPageableInvestments(currentPage, pageSize, selectedState)
      .subscribe({
        next: (data: InvestmentState) => {
          this.totalInvesti = data.totalInvesti;
          this.investments = [...data.investments.content];
          this.noResults = data.investments.content.length === 0;
          this.totalRecords = data.investments.totalElements;

          const groupedMap: { [key: string]: Investments } = {};
          data.investments.content.forEach((inv: Investments) => {
            const start = dayjs(inv.createdAt);
            const now = dayjs();
          
            const totalMonths = now.diff(start, 'month');
            const years = Math.floor(totalMonths / 12);
            const months = totalMonths % 12;
          
            const detention =
              years === 0 && months === 0
                ? 'Moins d’un mois'
                : years === 0
                ? `${months} mois`
                : months === 0
                ? `${years} an${years > 1 ? 's' : ''}`
                : `${years} an${years > 1 ? 's' : ''} et ${months} mois`;
          
            inv.detentionDuration = detention; 
                    

            if (groupedMap[inv.scpiName]) {
              groupedMap[inv.scpiName].totalAmount += inv.totalAmount;
              groupedMap[inv.scpiName].numberShares += inv.numberShares;
            } else {
              groupedMap[inv.scpiName] = { ...inv };
            }
          });

          this.groupedInvestments = Object.values(groupedMap);

          if (this.totalInvesti > 0 && !this.statisticsLoaded) {
            this.loadStatistics();
            this.statisticsLoaded = true;
          }
        },
        error: () => {
          this.error = "Erreur lors du chargement des investissements.";
        },
      });
  }

  handleParamsChange(params: any) {
    this.params = { ...this.params, ...params };
    this.loadInvestments();
  }

  startInvesting(): void {
    this.router.navigate(["/scpi"]);
  }
}
