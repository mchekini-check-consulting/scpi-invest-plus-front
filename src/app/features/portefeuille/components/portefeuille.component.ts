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
        console.log("I'm here", this.repSectoriel)

        this.distributionHistory = Object.entries(stats.distributionHistory ?? {}).map(
          ([yearStr, distributionRate], index) => {
            const year = Number(yearStr);
            const yearId = new YearStat(year, index); 
            return new StatYear(yearId, distributionRate, 0, 0);
          }
        );
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
            const detentionYears = dayjs().year() - dayjs(inv.createdAt).year();
            inv.detentionYears = detentionYears;

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
