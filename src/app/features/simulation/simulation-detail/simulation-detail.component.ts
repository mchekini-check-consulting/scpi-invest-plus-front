import { Component, Input, OnInit } from "@angular/core";
import { AddScpiToSimulationComponent } from "@/features/simulation/components/add-scpi-to-simulation/add-scpi-to-simulation.component";
import { Card } from "primeng/card";
import { PrimeTemplate } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { SimulationService } from "@/core/service/simulation.service";
import { Simulation, ScpiSimulation } from "@/core/model/Simulation";
import { Panel } from "primeng/panel";
import { DecimalPipe } from "@angular/common";
import { MapComponent } from "@/shared/component/map/map.component";
import { Location } from "@/core/model/Location";
import { ChartModule } from "primeng/chart";
import { Sector } from "@/core/model/Sector";
import { CommonModule } from '@angular/common';
import { RenameSimulationDialogComponent } from "../components/simulation-creator/simulation_dialogs/rename-simulation-dialog/rename-simulation-dialog.component";
import { Router } from "@angular/router";
import { ButtonModule } from 'primeng/button';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: "app-simulation-detail",
  imports: [
    AddScpiToSimulationComponent,
    Card,
    PrimeTemplate,
    Panel,
    DecimalPipe,
    MapComponent,
    ButtonModule,
    CommonModule,
    ChartModule,
    RenameSimulationDialogComponent,

  ],
  templateUrl: "./simulation-detail.component.html",
  styleUrls: ["./simulation-detail.component.css"],
})
export class SimulationDetailComponent implements OnInit {
  simulationId: string = "";
  addScpi = true;
  simulation: Simulation | null = null;
  ListeLocations: Location[] = [];
  simulationName = 'Simulation';
  investorEmail: string = '';
  isDeleteDialogVisible = false;
  isDialogVisible = false;

  options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  sectorData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  } = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#5A54F9", "#8674FC", "#C084FC"],
        hoverBackgroundColor: ["#7165FA", "#9D8AFC", "#D29FFC"],
      },
    ],
  };

  geographicalData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
      hoverBackgroundColor: string[];
    }[];
  } = {
    labels: [],
    datasets: [
      {
        data: [],
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

    if (id ) {
      this.simulationId = id;
      this.simulationService.getSimulationById(id).subscribe();
      this.simulationService.simulation$.subscribe((simulation) => {
        this.simulation = simulation;
        this.updateSectorData();
        this.updateLocationData();
        this.updateScpiInvestmentData();
      });
    }else {
      this.simulationService.simulation$.subscribe((simulation) => {
        this.simulation = simulation;
        console.log("La simulation dans les details = ", this.simulation)
        this.updateSectorData();
        this.updateLocationData();
        this.updateScpiInvestmentData();
      });
    }
  }

  ngOnInit(): void {}



  updateSectorData(): void {
    if (this.simulation?.sectors && this.simulation.sectors.length > 0) {
      this.sectorData.labels = this.simulation.sectors.map(
        (sector: Sector) =>
          sector.id.name + " (" + sector.sectorPercentage + "%)"
      );
      this.sectorData.datasets[0].data = this.simulation.sectors.map(
        (sector: Sector) => sector.sectorPercentage
      );
    }
  }

  openDialog() {
    this.isDialogVisible = true;
  }


  updateSimulationName(newName: string) {
    if (!newName.trim()) {
      return;
    }
    const formattedDate = new Date().toISOString().split('T')[0];


    this.simulationName = newName;
  }

  updateScpiInvestmentData(): void {
    if (
      this.simulation?.scpiSimulations &&
      this.simulation.scpiSimulations.length > 0
    ) {
      const totalInvestment = this.simulation.totalInvestment;

      if (totalInvestment === 0) {
        console.warn(
          "⚠️ Le total de l'investissement est à 0, impossible de calculer les pourcentages."
        );
        return;
      }

      this.geographicalData.labels = this.simulation.scpiSimulations.map(
        (scpi: ScpiSimulation) => scpi.scpiName || `SCPI ${scpi.scpiId}`
      );

      this.geographicalData.datasets[0].data =
        this.simulation.scpiSimulations.map((scpi: ScpiSimulation) =>
          parseFloat(((scpi.rising / totalInvestment) * 100).toFixed(2))
        );
    }
  }

  updateLocationData(): void {
    if (
      this.simulation?.locations &&
      Array.isArray(this.simulation.locations)
    ) {
      console.log("service simulation", this.simulationService.simulation$)
      this.ListeLocations = this.simulation.locations.map((location: any) => ({
        countryPercentage: location.countryPercentage,
        id: {
          scpiId: location.id.scpiId,
          country: location.id.country,
        },
      }));
    }
    console.log("ListeLocations dans details ligne 189 : ", this.ListeLocations)

  }
}
