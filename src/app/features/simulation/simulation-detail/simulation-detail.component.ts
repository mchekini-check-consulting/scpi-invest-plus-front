import { Component, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DecimalPipe } from "@angular/common";
import { SimulationService } from "@/core/service/simulation.service";
import { Simulation, ScpiSimulation } from "@/core/model/Simulation";
import { Location } from "@/core/model/Location";
import { Sector } from "@/core/model/Sector";

// Components et modules Angular/PrimeNG
import { AddScpiToSimulationComponent } from "@/features/simulation/components/add-scpi-to-simulation/add-scpi-to-simulation.component";
import { RenameSimulationDialogComponent } from "../components/simulation-creator/simulation_dialogs/rename-simulation-dialog/rename-simulation-dialog.component";
import { MapComponent } from "@/shared/component/map/map.component";
import { Card } from "primeng/card";
import { Panel } from "primeng/panel";
import { ButtonModule } from "primeng/button";
import { ChartModule } from "primeng/chart";

@Component({
  selector: "app-simulation-detail",
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    Card,
    Panel,
    ButtonModule,
    ChartModule,
    AddScpiToSimulationComponent,
    RenameSimulationDialogComponent,
    MapComponent,
  ],
  templateUrl: "./simulation-detail.component.html",
  styleUrls: ["./simulation-detail.component.css"],
})
export class SimulationDetailComponent {
  simulationId: string = "";
  addScpi = true;
  simulation: Simulation | null = null;
  ListeLocations: Location[] = [];
  simulationName = "Simulation";
  investorEmail: string = "";
  isDeleteDialogVisible = false;
  isDialogVisible = false;
  isDetailRoute: boolean = false;

  options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  sectorData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: ["#5A54F9", "#8674FC", "#C084FC"],
        hoverBackgroundColor: ["#7165FA", "#9D8AFC", "#D29FFC"],
      },
    ],
  };

  geographicalData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: ["#5A54F9", "#8674FC", "#C084FC"],
        hoverBackgroundColor: ["#7165FA", "#9D8AFC", "#D29FFC"],
      },
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private simulationService: SimulationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    const id = this.route.snapshot.paramMap.get("id");

    if (id) {
      this.simulationId = id;
      this.simulationService.getSimulationById(id).subscribe();
      this.simulationService.simulation$.subscribe((simulation) => {
        this.simulation = simulation;
        this.updateSectorData();
        this.updateLocationData();
        this.updateScpiInvestmentData();
      });
    } else {
      this.simulationService.simulation$.subscribe((simulation) => {
        this.simulation = simulation;
        this.updateSectorData();
        this.updateLocationData();
        this.updateScpiInvestmentData();
      });
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.isDetailRoute = !!params["id"];
    });
    this.simulationService.getInvestorInfos();
  }

  openDialog() {
    this.isDialogVisible = true;
  }

  updateSimulationName(newName: string) {
    if (!newName.trim()) return;
    this.simulationName = newName;
  }

  updateSectorData(): void {
    if (this.simulation?.sectors?.length) {
      this.sectorData = {
        labels: this.simulation.sectors.map(
          (sector: Sector) =>
            `${sector.id.name} (${sector.sectorPercentage}%)`
        ),
        datasets: [
          {
            data: this.simulation.sectors.map(
              (sector: Sector) => sector.sectorPercentage
            ),
            backgroundColor: ["#5A54F9", "#8674FC", "#C084FC"],
            hoverBackgroundColor: ["#7165FA", "#9D8AFC", "#D29FFC"],
          },
        ],
      };
    }
  }

  updateScpiInvestmentData(): void {
    const totalInvestment = this.simulation?.totalInvestment ?? 0;
    if (!this.simulation?.scpiSimulations?.length || totalInvestment === 0) {
      console.warn("⚠️ Données SCPI manquantes ou investissement total nul.");
      return;
    }

    this.geographicalData = {
      labels: this.simulation.scpiSimulations.map(
        (scpi: ScpiSimulation) => scpi.scpiName || `SCPI ${scpi.scpiId}`
      ),
      datasets: [
        {
          data: this.simulation.scpiSimulations.map((scpi: ScpiSimulation) =>
            parseFloat(((scpi.rising / totalInvestment) * 100).toFixed(2))
          ),
          backgroundColor: ["#5A54F9", "#8674FC", "#C084FC"],
          hoverBackgroundColor: ["#7165FA", "#9D8AFC", "#D29FFC"],
        },
      ],
    };
  }

  updateLocationData(): void {
    if (Array.isArray(this.simulation?.locations)) {
      this.ListeLocations = this.simulation.locations.map((location: any) => ({
        countryPercentage: location.countryPercentage,
        id: {
          scpiId: location.id.scpiId,
          country: location.id.country,
        },
      }));
    }
  }

  getTotalGrossRevenue(): string {
    const total = this.simulation?.scpiSimulations?.reduce(
      (sum, scpi) => sum + (scpi.grossRevenue || 0),
      0
    ) ?? 0;

    return total.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getTotalNetRevenue(): string {
    const total = this.simulation?.scpiSimulations?.reduce(
      (sum, scpi) => sum + (scpi.netRevenue || 0),
      0
    ) ?? 0;

    return total.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
