import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Investments } from "@/core/model/Investments";
import { PaginatorModule } from "primeng/paginator";
import { TabViewModule } from "primeng/tabview";
import { MessageService } from "primeng/api";
import { CommonModule } from "@angular/common";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
import { MapComponent } from "@/shared/component/map/map.component";
import { LocationId } from "@/core/model/Location";
import { Sector } from "@/core/model/Sector";
import { ChartModule } from "primeng/chart";
import { ChartComponent } from "@/shared/component/chart/chart.component";
import { StatYear } from "@/core/model/StatYear";

@Component({
  selector: "app-investments",
  imports: [
    PaginatorModule,
    TabViewModule,
    CommonModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    MapComponent,
    ChartModule,
    ChartComponent,
    CardModule,
  ],
  templateUrl: "./investments.component.html",
  styleUrl: "./investments.component.css",
  providers: [MessageService],
})
export class InvestmentsComponent {
  @Input() investments: Investments[] = [];
  @Input() groupedInvestments!: Investments[];
  @Input() totalInvesti: number = 0;
  @Input() image!: string;
  @Input() noResults: boolean = false;
  @Input() totalRecords: number = 0;
  @Input() pageSize: number = 10;
  @Output() paramsChanged = new EventEmitter<any>();
  @Input() repGeographique: { id: LocationId; countryPercentage: number }[] =
    [];
  @Input() repSectoriel: Sector[] = [];
  @Input() distributionHistory: StatYear[] = [];
  distributionChartData: any;
  yearsDistribution: number[] = [];
  distributionRates: number[] = [];
  chartOptions: any;
  chartData: any;

  filteredInvestmentsMap: { [key: string]: Investments[] } = {};
  selectedState: string = "VALIDATED";
  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);
  expandedRows: { [key: string]: boolean } = {};

  constructor(private messageService: MessageService) {}

  ngOnChanges() {
    this.MethDistributionHistory();
    this.MethRepSectoriel();
  }

  MethRepSectoriel(): void {
    if (this.repSectoriel && this.repSectoriel.length > 0) {
      this.chartData = {
        labels: this.repSectoriel.map((s) => s.id.name),
        datasets: [
          {
            label: "Repartition sectorielle (%)",
            data: this.repSectoriel.map((s) => s.sectorPercentage),
            backgroundColor: [
              "#0b0d98",
              "#3b5998",
              "#FFCE56",
              "#AA66CC",
              "#99CC00",
              "#FF4444",
              "#FFAE56",
              "#AA96CC",
            ],
          },
        ],
      };
    }
  }

  MethDistributionHistory(): void {
    if (this.distributionHistory && this.distributionHistory.length > 0) {
      this.yearsDistribution = this.distributionHistory.map(
        (item) => item.yearStat.yearStat
      );
      this.distributionRates = this.distributionHistory.map(
        (item) => item.distributionRate
      );

      this.distributionChartData = {
        labels: this.yearsDistribution,
        datasets: [
          {
            label: "Taux de distribution (%)",
            data: this.distributionRates,
            borderColor: "#3b5998",
            backgroundColor: "rgba(165, 82, 212, 0.2)",
            fill: true,
          },
        ],
      };
    }
  }

  tabStates = [
    { label: "Acceptée", value: "VALIDATED" },
    { label: "En cours de traitement", value: "En cours" },
    { label: "En attente de paiement", value: "PENDING_PAYMENT" },
    { label: "Refusée", value: "REJECTED" },
    { label: "Répartition globale", value: "Répartition" },
  ];

  getInvestmentTypeTranslate(type: string): string {
    switch (type) {
      case "PLEINE_PROPRIETE":
        return "Pleine propriété";
      case "USUFRUIT":
        return "Usufruit";
      case "NUE_PROPRIETE":
        return "Nue propriété";
      default:
        return type;
    }
  }

  toggleRow(investment: Investments): void {
    const isExpanded = this.expandedRows[investment.id];
    this.expandedRows[investment.id] = !isExpanded;

    if (!isExpanded) {
      this.filteredInvestmentsMap[investment.scpiName] =
        this.investments.filter((inv) => inv.scpiName === investment.scpiName);
    } else {
      delete this.filteredInvestmentsMap[investment.scpiName];
    }
  }

  expandAll(): void {
    this.expandedRows = {};
    this.filteredInvestmentsMap = {};

    this.groupedInvestments.forEach((inv) => {
      this.expandedRows[inv.id] = true;
      this.filteredInvestmentsMap[inv.scpiName] = this.investments.filter(
        (i) => i.scpiName === inv.scpiName
      );
    });
  }

  collapseAll(): void {
    this.expandedRows = {};
    this.filteredInvestmentsMap = {};
  }

  onRowExpand(event: any) {
    this.messageService.add({
      severity: "info",
      summary: "Row Expanded",
      detail: event.data.name,
    });
  }

  onRowCollapse(event: any) {
    this.messageService.add({
      severity: "info",
      summary: "Row Collapsed",
      detail: event.data.name,
    });
  }

  getFilteredInvestments(scpiName: string): Investments[] {
    return this.filteredInvestmentsMap[scpiName] || [];
  }

  onTabChange(event: any) {
    const newState = this.tabStates[event.index].value;
    if (newState === "Répartition") {
      this.selectedState = "Répartition";
      return;
    }
    this.selectedState = newState;
    this.paramsChanged.emit({ currentPage: 0, selectedState: newState });
  }

  onPageChange(event: any) {
    const currentPage = event.page;
    const pageSize = event.rows;

    this.paramsChanged.emit({
      currentPage: currentPage,
      pageSize,
    });
  }

  getInvestmentStateTranslate(state: string): string {
    const stateMap: { [key: string]: string } = {
      VALIDATED: "Acceptée",
      REJECTED: "Refusée",
      PENDING_PAYMENT: "En attente de paiement",
      "En cours": "En cours de traitement",
    };
    return stateMap[state] || state;
  }

  getInvestmentSeverity(
    status: string
  ):
    | "success"
    | "info"
    | "warn"
    | "danger"
    | "secondary"
    | "contrast"
    | undefined {
    switch (status) {
      case "VALIDATED":
        return "success";
      case "REJECTED":
        return "danger";
      case "PENDING_PAYMENT":
        return "info";
      case "En cours":
        return "warn";

      default:
        return "secondary";
    }
  }

  getInvestmentImage(investissement: Investments): string {
    const index = this.groupedInvestments.indexOf(investissement);
    return this.images[index] || "img/scpi/default.webp";
  }
}
