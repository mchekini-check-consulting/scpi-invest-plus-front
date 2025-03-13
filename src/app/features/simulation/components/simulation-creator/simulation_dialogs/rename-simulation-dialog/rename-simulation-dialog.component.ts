import { Simulation, SimulationCreate } from "@/core/model/Simulation";
import { SimulationService } from "@/core/service/simulation.service";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Route, Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { take } from "rxjs";

@Component({
  selector: "app-rename-simulation-dialog",
  imports: [
    CardModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: "./rename-simulation-dialog.component.html",
  styleUrl: "./rename-simulation-dialog.component.css",
})
export class RenameSimulationDialogComponent {
  @Input() isDialogVisible: boolean = false;
  @Input() simulationName: string = "";
  @Output() closeDialog = new EventEmitter<void>();
  @Output() renameSimulation = new EventEmitter<string>();

  simulation: Simulation | null = null;

  newSimulationName: string = "";

  ngOnInit() {
    this.newSimulationName = this.simulationName;
  }
  constructor(private simulationService: SimulationService, private router : Router) {}

  onDialogHide() {
    this.closeDialog.emit();
  }

  saveSimulationName() {
    this.renameSimulation.emit(this.newSimulationName);


    this.simulationService.simulation$.pipe(take(1)).subscribe((simulation) => {
      this.simulation = simulation;
      let today = new Date();
      let day = String(today.getDate()).padStart(2, "0");
      let month = String(today.getMonth() + 1).padStart(2, "0");
      let year = today.getFullYear();
      let simulationDate = `${year}-${month}-${day}`;


      let simulationCreation: SimulationCreate = {
        name: this.newSimulationName,
        simulationDate: simulationDate,
        scpis: this.simulation?.scpiSimulations.map((scpi) => ({
          scpiId: scpi.scpiId,
          numberPart: scpi.numberPart,
          partPrice: scpi.partPrice,
          rising: scpi.rising,
          duree: scpi.duree,
          dureePercentage: scpi.dureePercentage,
          propertyType: scpi.propertyType,
        })) || [],
      };

      this.simulationService.createSimulation(simulationCreation).subscribe({
        next: (response) => {
          this.router.navigate([`simulations`]);;
        },
        error: (error) => {
          console.error("Erreur lors de l’ajout de la simulation", error);
        },
      });
    });


    this.closeDialog.emit();
  }

}
