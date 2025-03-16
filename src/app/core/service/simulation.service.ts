import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
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
import { UserService } from "./user.service";
import { InvestorService } from "./investor.service";

@Injectable({
  providedIn: "root",
})
export class SimulationService {
  private apiUrl = "/api/v1/simulation";
  private simulationSubject = new BehaviorSubject<Simulation | null>(null);
  simulation$ = this.simulationSubject.asObservable();

  // Définition du barème fiscal (modifiable selon vos règles)
  private TAX_BRACKETS = [
    { lower: 0, upper: 11294, rate: 0 },
    { lower: 11294, upper: 27478, rate: 11 },
    { lower: 27478, upper: 78570, rate: 30 },
    { lower: 78570, upper: 168994, rate: 41 },
    { lower: 168994, upper: Infinity, rate: 45 },
  ];

  // Propriété pour stocker l'investisseur récupéré
  private investor: any = null;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private investorService: InvestorService
  ) {}

  // --- Méthodes CRUD et de gestion de simulation ---

  getSimulations(): Observable<Simulation[]> {
    return this.http.get<Simulation[]>(this.apiUrl);
  }

  createSimulation(simulation: SimulationCreate): Observable<Simulation> {
    return this.http
      .post<Simulation>(this.apiUrl, simulation)
      .pipe(
        tap((response) => {
          this.simulationSubject.next(response);
          // Lancer le calcul fiscal après création
          this.calculateFiscalSimulation();
        }),
        catchError((error) => {
          console.error("Error creating simulation:", error);
          return throwError(() => error);
        })
      );
  }

  getSimulationById(id: string | number): Observable<Simulation> {
    return this.http.get<Simulation>(`${this.apiUrl}/${id}`).pipe(
      tap((simulation) => {
        this.simulationSubject.next(simulation);
        // Lancer le calcul fiscal dès qu'on récupère la simulation
        this.calculateFiscalSimulation();
      })
    );
  }

  deleteSimulation(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error("Erreur lors de la suppression de la simulation:", error);
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
    currentSimulation.scpiSimulations.push(<ScpiSimulation>scpiData);
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

    // Calcul des pourcentages pour les localisations et secteurs
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

    const simulationResult: Simulation = {
      id: -1,
      name: simulationCreation.name,
      simulationDate: new Date().toISOString().split("T")[0],
      monthlyIncome,
      totalInvestment: simulationCreation.totalInvestment,
      grossRevenue: 0,
      netRevenue: 0,
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

  // --- Méthodes pour la logique fiscale ---

  // 1. Calculer le nombre de parts fiscales selon la situation familiale et le nombre d'enfants
  private calculerPartsFiscales(situation: string, nbEnfants: number): number {
    let parts = situation.toLowerCase() === "marié" ? 2 : 1;
    parts += Math.min(nbEnfants, 2) * 0.5;
    if (nbEnfants > 2) {
      parts += nbEnfants - 2;
    }
    return parts;
  }

  // 2. Calculer l'impôt total en appliquant le barème fiscal
  private calculerImpotTotal(
    revenuImposable: number,
    parts: number
  ): { totalTax: number; tauxMoyen: number; TMI: number } {
    const quotient = revenuImposable / parts;
    let impotParPart = 0;
    let tauxMarginal = 0;

    for (let i = 0; i < this.TAX_BRACKETS.length; i++) {
      const tranche = this.TAX_BRACKETS[i];
      if (quotient > tranche.lower) {
        const taxableAmount = Math.min(quotient, tranche.upper) - tranche.lower;
        impotParPart += taxableAmount * (tranche.rate / 100);
        tauxMarginal = tranche.rate;
      } else {
        break;
      }
    }

    const impotTotal = impotParPart * parts;
    const tauxMoyen = (impotTotal / revenuImposable) * 100;
    return {
      totalTax: +impotTotal.toFixed(2),
      tauxMoyen: +tauxMoyen.toFixed(2),
      TMI: tauxMarginal,
    };
  }

  // 3. Récupérer l'investisseur et déclencher les calculs fiscaux
  public calculateFiscalSimulation(): void {
    const user = this.userService.getUser();
    if (!user || !user.email) {
      console.warn("Utilisateur non connecté ou email manquant.");
      return;
    }

    this.investorService.getInvestorByEmail(user.email).subscribe({
      next: (investorData) => {
        this.investor = investorData;
        this.updateFiscalCalculations();
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'investisseur", err);
      },
    });
  }

  // 4. Mettre à jour les calculs fiscaux et intégrer les résultats dans l'objet Simulation
  private updateFiscalCalculations(): void {
    if (!this.investor) {
      console.warn("Investor non récupéré, impossible de calculer les données fiscales.");
      return;
    }

    // Récupérer les informations de l'investisseur
    const revenuImposable = this.investor.annualIncome || 60000;
    const situation = this.investor.maritalStatus || "marié";
    const nbEnfants = this.investor.numberOfChildren ? parseInt(this.investor.numberOfChildren) : 0;

    // Calcul des parts fiscales et du quotient familial
    const partsFiscales = this.calculerPartsFiscales(situation, nbEnfants);
    const quotientFamilial = revenuImposable / partsFiscales;
    console.log("Quotient Familial:", quotientFamilial);

    // Calcul de l'impôt total, du taux moyen et du taux marginal (TMI)
    const { totalTax, tauxMoyen, TMI } = this.calculerImpotTotal(revenuImposable, partsFiscales);
    console.log("Impôt Total:", totalTax, "Taux Moyen:", tauxMoyen, "TMI:", TMI);

    // --- Calcul du revenu brut mensuel ---
    const currentSimulation = this.simulationSubject.value;
    if (!currentSimulation) {
      console.warn("Aucune simulation disponible pour le calcul fiscal.");
      return;
    }
    // On suppose que les informations de la SCPI se trouvent dans la première SCPI simulation
    const partPrice = currentSimulation.scpiSimulations[0]?.partPrice || 100;
    const numberPart = currentSimulation.scpiSimulations[0]?.numberPart || 10;
    let distributionRate = 0;
    // Récupérer le taux de distribution via la SCPI (on utilise ici le tableau statYears)
    if (currentSimulation?.scpi && currentSimulation.scpi.statYears && currentSimulation.scpi.statYears.length > 0) {
      distributionRate = currentSimulation.scpi.statYears.reduce(
        (prev: number, curr: any) =>
          curr.yearStat.yearStat > prev ? curr.yearStat.yearStat : prev,
        0
      );
    }
    const grossRevenue = (partPrice * numberPart) * ((distributionRate / 100) / 12);
    console.log("Revenu Brut Mensuel:", grossRevenue);

    // --- Calcul du revenu net après fiscalité ---
    const partFrance = currentSimulation?.locations
      .filter((loc: any) => loc.scpi && loc.scpi.name.toLowerCase() === "france")
      .reduce((acc: number, curr: any) => acc + curr.countryPercentage, 0) || 0;
    const partEurope = 100 - partFrance;
    console.log("Part France:", partFrance, "Part Europe:", partEurope);

    const cotisationsSociales = 17.2;
    const netFrance = grossRevenue * (partFrance / 100) * (1 - ((TMI + cotisationsSociales) / 100));
    const netEurope = grossRevenue * (partEurope / 100) * (1 - ((TMI - tauxMoyen) / 100));
    const netRevenue = +(netFrance + netEurope).toFixed(2);
    console.log("Revenu Net Mensuel:", netRevenue);

    // Mettre à jour l'objet Simulation avec les résultats fiscaux
    const simulationResult: Simulation = {
      ...currentSimulation,
      grossRevenue: grossRevenue,
      netRevenue: netRevenue,
    };

    this.simulationSubject.next(simulationResult);
  }
}
