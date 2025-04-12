import { Investments } from "@/core/model/Investments";
import { InvestmentService } from "@/core/service/InvestmentService";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { MessageService } from "primeng/api";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { Component, OnInit, Input} from "@angular/core";
import { CardComponent } from "@/shared/component/card/card.component";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { Location } from '@/core/model/Location';
import { PaginatorModule } from "primeng/paginator";
import { ChartModule } from 'primeng/chart';
import { MapComponent } from "@/shared/component/map/map.component";

@Component({
  selector: "app-portefeuille",
  imports: [
    ButtonModule,
    CommonModule,
    CardModule,
    TabViewModule,
    TableModule,
    TagModule,
    CardComponent,
    PaginatorModule,
    ChartModule,
    MapComponent
  ],
  templateUrl: "./portefeuille.component.html",
  styleUrl: "./portefeuille.component.css",
  providers: [MessageService],
})
export class PortefeuilleComponent implements OnInit {
  ListeLocations: { country: string; amount: number }[] = [];
  updateGeographicalData(data: { country: string; amount: number }[]) {
    this.ListeLocations = data;
  }
  sectorialData: { sector: string, amount: number }[] = [];

  @Input() image!: string;
  images = Array.from({ length: 10 }, (_, i) => `img/scpi/${i + 1}.webp`);
  investissements: Investments[] = [];
  paginatedInvestissements: Investments[] = [];
  expandedRows: { [key: string]: boolean } = {};
  selectedState: string = "VALIDATED";
  filteredInvestments: Investments[] = [];
  originalInvestments: Investments[] = [];
  showHint: boolean = true;
  showDetailsComponents: boolean = false;
  currentPage: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  hasAnyInvestments: boolean = false;

  constructor(
    private investmentService: InvestmentService,
    private router: Router,
    private messageService: MessageService ) {
    setTimeout(() => {
      this.showHint = false;
    }, 6000);
  }

  ngOnInit(): void {
    
    if (this.selectedState === 'Détails') {
      return;
  }
    this.getPageableInvestments();
  }


  public getPageableInvestments(): void {
    if (this.selectedState === 'Détails') {
      return;
  }
    this.investmentService
      .getPageableInvestments(this.currentPage, this.rows, this.selectedState)
      .subscribe(
        (response) => {

          this.originalInvestments = response.content;

          const groupedInvestments: { [key: string]: Investments } = {};
          this.originalInvestments.forEach((inv: Investments) => {
            if (groupedInvestments[inv.scpiName]) {
              groupedInvestments[inv.scpiName].totalAmount += inv.totalAmount;
              groupedInvestments[inv.scpiName].numberShares += inv.numberShares;
            } else {
              groupedInvestments[inv.scpiName] = { ...inv };
            }
          });

          this.investissements = Object.values(groupedInvestments);
          this.paginatedInvestissements = [...this.investissements];
          this.totalRecords = response.totalElements;

          this.checkAnyInvestments();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
  }

  checkAnyInvestments(): void {
    const allStates =  [
      "VALIDATED",
      "En cours",
      "ACCEPTED",
      "REJECTED",
    ];
  
    let total = 0;
    let checked = 0;
  
    allStates.forEach((state) => {
      this.investmentService
        .getPageableInvestments(0, 1, state)
        .subscribe((response) => {
          total += response.totalElements;
          checked++;
          if (checked === allStates.length) {
            this.hasAnyInvestments = total > 0;
          }
        });
    });
  }
  

      public geographicalDistribution: Location[] = [];

      onGeographicalDataReceived(data: { country: string; amount: number }[]): void {
        this.geographicalDistribution = data.map((item) => ({
          id: {
            country: item.country,
            scpiId: 0,
          },
          countryPercentage: item.amount,
        }));      
      }

      onSectorialDataReceived(data: any): void {
        this.sectorialData = data;
      }
      


  getInvestmentImage(investissement: Investments): string {
    const index = this.investissements.indexOf(investissement);
    return this.images[index] || "img/scpi/default.webp";
  }

  toggleRow(investissement: Investments) {
    if (this.selectedState === 'Détails') {
      return;
  }
    const id = investissement.id;
    const scpiName = investissement.scpiName;

    if (this.expandedRows[id]) {
      delete this.expandedRows[id];
      this.filteredInvestments = [];
    } else {
      this.expandedRows = {};
      this.expandedRows[id] = true;

      this.filteredInvestments = this.originalInvestments.filter(
        (inv) => inv.scpiName === scpiName
      );
    }

    this.expandedRows = { ...this.expandedRows };
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

  expandAll() {
    this.expandedRows = {};
    this.filteredInvestments = [];

    this.investissements.forEach((data) => {
      this.expandedRows[data.id] = true;

      const details = this.originalInvestments.filter(
        (inv) => inv.scpiName === data.scpiName
      );

      this.filteredInvestments.push(...details);
    });

    setTimeout(() => {
      this.expandedRows = { ...this.expandedRows };
    });
  }

  collapseAll() {
    this.expandedRows = {};
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.rows = event.rows;
    this.getPageableInvestments();
  }

  onTabChange(event: any) {
    const stateMap = [
      "VALIDATED",
      "En cours",
      "ACCEPTED",
      "REJECTED",
      "Détails",
    ];
    this.selectedState = stateMap[event.index];

    if (this.selectedState === "Détails") {
      this.showDetailsComponents = true;
    } else {
      this.currentPage = 0;
      this.showDetailsComponents = false;
      this.getPageableInvestments();
    }
  }

  getInvestmentStateTranslate(state: string): string {
    const stateMap: { [key: string]: string } = {
      VALIDATED: "Acceptée",
      REJECTED: "Refusée",
      ACCEPTED: "En attente de paiement",
      "En cours": "En cours de traitement",
    };
    return stateMap[state] || state;
  }

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
      case "ACCEPTED":
        return "info";
      case "En cours":
        return "warn";
      
      default:
        return "secondary";
    }
  }

  startInvesting(): void {
    this.router.navigate(["/scpi"]);
  }
}
