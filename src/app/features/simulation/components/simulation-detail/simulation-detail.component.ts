import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule, DecimalPipe } from "@angular/common";
import { SimulationService } from "@/core/service/simulation.service";
import { ScpiSimulation, Simulation } from "@/core/model/Simulation";
import { Location } from "@/core/model/Location";
import { Sector } from "@/core/model/Sector";
import { AddScpiToSimulationComponent } from "@/features/simulation/components/add-scpi-to-simulation/add-scpi-to-simulation.component";
import { RenameSimulationDialogComponent } from "../simulation-creator/simulation_dialogs/rename-simulation-dialog/rename-simulation-dialog.component";
import { MapComponent } from "@/shared/component/map/map.component";
import { Card } from "primeng/card";
import { Panel } from "primeng/panel";
import { ButtonModule } from "primeng/button";
import { ChartModule } from "primeng/chart";
import { ChartComponent } from "@/shared/component/chart/chart.component";

@Component({
  selector: "app-simulation-detail",
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    Card,
    Panel,
    ButtonModule,
    ChartComponent,
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

  lineChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  data = {
    labels: [] as any[],
    datasets: [
      {
        label: "Distribution (%)",
        data: [] as number[],
        fill: true,
        backgroundColor: "rgba(90, 84, 249, 0.2)",
        borderColor: "#5A54F9",
        tension: 0.4,
      },
    ],
  };

  sectorData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          "#5EC8E4",
          "#1B8989",
          "#3B5998",
          "#346A1D",
          "#1E6F85",
          "#FFAE56",
          "#3D85C6",
          "#3D85C6",
        ],
        hoverBackgroundColor: [
          "#5EC8E4",
          "#1B8989",
          "#3B5998",
          "#346A1D",
          "#1E6F85",
          "#FFAE56",
          "#3D85C6",
          "#3D85C6",
        ],
      },
    ],
  };

  geographicalData = {
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        backgroundColor: [
          "#5EC8E4",
          "#1B8989",
          "#3B5998",
          "#346A1D",
          "#1E6F85",
          "#FFAE56",
          "#3D85C6",
          "#3D85C6",
        ],
        hoverBackgroundColor: [
          "#5EC8E4",
          "#1B8989",
          "#3B5998",
          "#346A1D",
          "#1E6F85",
          "#FFAE56",
          "#3D85C6",
          "#3D85C6",
        ],
      },
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private simulationService: SimulationService
  ) {
    const id = this.route.snapshot.paramMap.get("id");

    if (id) {
      this.simulationId = id;
      this.simulationService.getSimulationById(id).subscribe();
    }

    this.simulationService.simulation$.subscribe((simulation) => {
      this.simulation = simulation;
      this.updateSectorData();
      this.updateLocationData();
      this.updateScpiInvestmentData();
      this.updateChartData();
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.isDetailRoute = !!params["id"];
    });
    this.simulationService.getInvestorInfos();
  }

  updateChartData(): void {
    if (this.simulation?.years && this.simulation?.distributionYear) {
      this.data = {
        labels: this.simulation.years,
        datasets: [
          {
            label: "Distribution (%)",
            data: this.simulation.distributionYear,
            fill: true,
            borderColor: "#1e6f85",
            backgroundColor: "rgba(65, 131, 168, 0.2)",
            tension: 0.4,
          },
        ],
      };
    }
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
          (sector: Sector) => `${sector.id.name} (${sector.sectorPercentage}%)`
        ),
        datasets: [
          {
            data: this.simulation.sectors.map(
              (sector: Sector) => sector.sectorPercentage
            ),
            backgroundColor: [
              "#5EC8E4",
              "#1B8989",
              "#3B5998",
              "#346A1D",
              "#1E6F85",
              "#FFAE56",
              "#3D85C6",
              "#3D85C6",
            ],
            hoverBackgroundColor: [
              "#5EC8E4",
              "#1B8989",
              "#3B5998",
              "#346A1D",
              "#1E6F85",
              "#FFAE56",
              "#3D85C6",
              "#3D85C6",
            ],
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
          backgroundColor: [
            "#5EC8E4",
            "#1B8989",
            "#3B5998",
            "#346A1D",
            "#1E6F85",
            "#FFAE56",
            "#3D85C6",
            "#3D85C6",
          ],
          hoverBackgroundColor: [
            "#5EC8E4",
            "#1B8989",
            "#3B5998",
            "#346A1D",
            "#1E6F85",
            "#FFAE56",
            "#3D85C6",
            "#3D85C6",
          ],
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
    const total =
      this.simulation?.scpiSimulations?.reduce(
        (sum, scpi) => sum + (scpi.grossRevenue || 0),
        0
      ) ?? 0;

    return total.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  getTotalNetRevenue(): string {
    const total =
      this.simulation?.scpiSimulations?.reduce(
        (sum, scpi) => sum + (scpi.netRevenue || 0),
        0
      ) ?? 0;

    return total.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
