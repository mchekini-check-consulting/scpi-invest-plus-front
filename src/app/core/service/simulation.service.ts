import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of, switchMap, tap, throwError } from "rxjs";
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

  deleteSimulation(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addScpiToSimulation(scpiData: Scpi, locations: Location[], sectors: Sector[]): Observable<Simulation> {
    const currentSimulation = this.simulationSubject.value;

    if (!currentSimulation || !currentSimulation.id) {
      console.error("Aucune simulation sélectionnée.");
      return throwError(() => new Error("Aucune simulation sélectionnée."));
    }

    // Mettre à jour le totalInvestment en ajoutant le rising de la nouvelle SCPI
    currentSimulation.totalInvestment += scpiData.rising;

    currentSimulation.scpiSimulations.push(scpiData);

    currentSimulation.locations = [
      ...currentSimulation.locations,
      ...locations
    ];


    currentSimulation.sectors = [
      ...currentSimulation.sectors,
      ...sectors
    ];


    this.calculateSimulationResults(currentSimulation);


    this.simulationSubject.next(currentSimulation);

    return of(currentSimulation);
}




calculateSimulationResults(simulationCreation: Simulation): void {

  if (!simulationCreation.scpiSimulations || simulationCreation.scpiSimulations.length === 0) {
      console.warn("Aucune SCPI simulation trouvée.");
      return;
  }

  let monthlyIncome = 0;
  let total = simulationCreation.totalInvestment
  const sectorInvestments: Map<string, number> = new Map();
  const countryInvestments: Map<string, number> = new Map();

  // 1. Calculer l'investissement total et les revenus mensuels
  simulationCreation.scpiSimulations.forEach((scpiSimulation: any) => {
      const rate = scpiSimulation.statYear;
      const investedAmount = scpiSimulation.rising;

      // Calcul du revenu mensuel
      const income = investedAmount * (rate / 100);
      monthlyIncome += income;



      // Répartition des investissements par pays pour chaque SCPI
      simulationCreation.locations.forEach((location: Location) => {
          const countryName = location.id.country;
          const countryPercentage = location.countryPercentage;

          // Calcul de l'investissement de cette SCPI dans ce pays
          const investedAmountInCountry = (investedAmount * countryPercentage) / 100;

          console.log("___investedAmountInCountry",investedAmountInCountry,countryName);


          // Ajouter cet investissement à l'investissement total du pays
          countryInvestments.set(
              countryName,
              (countryInvestments.get(countryName) || 0) + investedAmountInCountry
                );

          console.log('countryInvestments___',countryInvestments,countryName);

      });

      // Répartition des investissements par secteur
      simulationCreation.sectors.forEach((sector: Sector) => {
          const sectorName = sector.id.name;
          const sectorPercentage = sector.sectorPercentage;

          // Calcul de l'investissement pour ce secteur
          const investedAmountInSector = (investedAmount * sectorPercentage) / 100;

          // Ajouter cet investissement au total du secteur
          sectorInvestments.set(
              sectorName,
              (sectorInvestments.get(sectorName) || 0) + investedAmountInSector
          );
      });
  });

  // 2. Calculer les pourcentages de répartition par pays sur le total global
  const locations = Array.from(countryInvestments.entries()).map(([countryName, total]) => ({
      id: { country: countryName },
      countryPercentage: (total / simulationCreation.totalInvestment) * 100,
  }));

  console.log("________________locations",locations);


  // 3. Calculer les pourcentages de répartition par secteur sur le total global
  const sectors = Array.from(sectorInvestments.entries()).map(([sectorName, total]) => ({
      id: { name: sectorName },
      sectorPercentage: (total / simulationCreation.totalInvestment) * 100, // Correction ici
  }));

  // 4. Vérification des pourcentages
  const totalSectorPercentage = sectors.reduce((acc, sector) => acc + sector.sectorPercentage, 0);
  const totalCountryPercentage = locations.reduce((acc, location) => acc + location.countryPercentage, 0);



  if (Math.abs(totalSectorPercentage - 100) > 0.1) {
      console.warn("Les pourcentages des secteurs ne totalisent pas 100%.");
  }
  if (Math.abs(totalCountryPercentage - 100) > 0.1) {
      console.warn("Les pourcentages des pays ne totalisent pas 100%.");
  }

  // 5. Création du résultat final de la simulation
  const simulationResult = {
      id: -1,
      name: simulationCreation.name,
      simulationDate: "2025-03-09",
      monthlyIncome,
      totalInvestment : simulationCreation.totalInvestment,
      scpiSimulations: simulationCreation.scpiSimulations.map((scpiSimulation: ScpiSimulation) => ({
          scpiId: scpiSimulation.scpiId,
          numberPart: scpiSimulation.numberPart,
          partPrice: scpiSimulation.partPrice,
          rising: scpiSimulation.rising,
          duree: scpiSimulation.duree,
          dureePercentage: scpiSimulation.dureePercentage,
          propertyType: scpiSimulation.propertyType || "Nue-propriétaire",
          scpiName: scpiSimulation.scpiName || "simulation",
      })),
      locations,
      sectors,
  };

  // Mise à jour de la simulation
  this.simulationSubject.next(simulationResult);
}




}
