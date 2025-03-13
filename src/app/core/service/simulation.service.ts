import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import {
  Scpi,
  ScpiSimulation,
  Simulation,
  SimulationCreate,
} from "../model/Simulation";
import { Sector } from "../model/Sector";
import { Location } from "../model/Location";
import { Ripple } from "primeng/ripple";

@Injectable({
  providedIn: "root",
})
export class SimulationService {
  private apiUrl = "/api/v1/simulation";
  private simulationSubject = new BehaviorSubject<any | null>(null);
  simulation$ = this.simulationSubject.asObservable();
  

  constructor(private http: HttpClient) {}

  getSimulations(): Observable<Simulation[]> {
    return this.http.get<Simulation[]>(this.apiUrl);
  }

  createSimulation(
    simulation: SimulationCreate,
    status: boolean
  ): Observable<Simulation> {
    return this.http
      .post<Simulation>(this.apiUrl, simulation, { params: { status } })
      .pipe(
        tap((response) => {
          this.simulationSubject.next(response);
        })
      );
  }

  getSimulationById(id: string | number): Observable<Simulation> {
    return this.http.get<Simulation>(this.apiUrl + "/" + id).pipe(
      tap<Simulation>((simulation) => {
        this.simulationSubject.next(simulation);
      })
    );
  }

  deleteSimulation(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression de la simulation:', error);
        throw error;
      })
    );
  }

  addScpiToSimulation(
    scpiData: Scpi,
    locations: Location[],
    sectors: Sector[]
  ): Observable<Simulation> {
    const currentSimulation = this.simulationSubject.value;

    if (!currentSimulation || !currentSimulation.id) {
      return throwError(() => new Error("Aucune simulation sélectionnée."));
    }

    const scpiAlreadyExists = currentSimulation.scpiSimulations.some(
      (scpi: Scpi) => scpi.scpiId === scpiData.scpiId
    );

    if (scpiAlreadyExists) {
      return throwError(() => new Error("Cette SCPI est déjà ajoutée."));
    }

    currentSimulation.totalInvestment += scpiData.rising;
    currentSimulation.scpiSimulations.push(scpiData);

    currentSimulation.locations = [
      ...currentSimulation.locations,
      ...locations,
    ];

    currentSimulation.sectors = [...currentSimulation.sectors, ...sectors];
    this.simulationSubject.next(currentSimulation);

    return of(currentSimulation);
  }


  calculateSimulationResults(simulationCreation: Simulation): void {
    if (
      !simulationCreation.scpiSimulations ||
      simulationCreation.scpiSimulations.length === 0
    ) {
      console.warn("Aucune SCPI simulation trouvée.");
      return;
    }

    let monthlyIncome = 0;
    const sectorInvestments: Map<string, number> = new Map();
    const countryInvestments: Map<string, number> = new Map();

    simulationCreation.scpiSimulations.forEach((scpiSimulation: any) => {
      const rate = scpiSimulation.statYear;
      const investedAmount = scpiSimulation.rising;

      const income = investedAmount * (rate / 100);
      monthlyIncome += income;

      if (
        scpiSimulation?.locations &&
        Array.isArray(scpiSimulation.locations)
      ) {
        scpiSimulation.locations.forEach((location: Location) => {
          const countryName = location.id.country;
          const countryPercentage = location.countryPercentage;

          const investedAmountInCountry =
            (investedAmount * countryPercentage) / 100;
          countryInvestments.set(
            countryName,
            (countryInvestments.get(countryName) || 0) + investedAmountInCountry
          );
        });
      } else {
        console.error(
          "scpiSimulation.locations est undefined ou n'est pas un tableau",
          scpiSimulation?.locations
        );
      }

      scpiSimulation.sectors.forEach((sector: Sector) => {
        const sectorName = sector.id.name;
        const sectorPercentage = sector.sectorPercentage;

        const investedAmountInSector =
          (investedAmount * sectorPercentage) / 100;
        sectorInvestments.set(
          sectorName,
          (sectorInvestments.get(sectorName) || 0) + investedAmountInSector
        );
      });
    });

    // Arrondi des pourcentages
    const locations = Array.from(countryInvestments.entries()).map(
      ([countryName, total]) => ({
        id: { country: countryName },
        countryPercentage:
          Math.round((total / simulationCreation.totalInvestment) * 100 * 100) /
          100,
      })
    );

    const sectors = Array.from(sectorInvestments.entries()).map(
      ([sectorName, total]) => ({
        id: { name: sectorName },
        sectorPercentage:
          Math.round((total / simulationCreation.totalInvestment) * 100 * 100) /
          100,
      })
    );

    const simulationResult = {
      id: -1,
      name: simulationCreation.name,
      simulationDate: new Date().toISOString().split("T")[0],
      monthlyIncome,
      totalInvestment: simulationCreation.totalInvestment,
      scpiSimulations: simulationCreation.scpiSimulations.map(
        (scpiSimulation: ScpiSimulation) => ({
          scpiId: scpiSimulation.scpiId,
          numberPart: scpiSimulation.numberPart,
          statYear: scpiSimulation.statYear,
          partPrice: scpiSimulation.partPrice,
          rising: scpiSimulation.rising,
          duree: scpiSimulation.duree,
          dureePercentage: scpiSimulation.dureePercentage,
          propertyType: scpiSimulation.propertyType,
          scpiName: scpiSimulation.scpiName,
          locations: [...locations],
          sectors: [...sectors],
        })
      ),
      locations: [...locations],
      sectors: [...sectors],
    };

    this.simulationSubject.next(simulationResult);
  }
}
