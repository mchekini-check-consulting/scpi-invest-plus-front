import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
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
import {Sector} from "../model/Sector";
import {Location} from "../model/Location";
import {Ripple} from "primeng/ripple";
import {UserService} from '@/core/service/user.service';
import {InvestorService} from '@/core/service/investor.service';
import {Investor} from '@/core/model/investor.model';

@Injectable({
  providedIn: "root",
})
export class SimulationService {
  private apiUrl = "/api/v1/simulation";
  private simulationSubject = new BehaviorSubject<any | null>(null);
  simulation$ = this.simulationSubject.asObservable();
  private investor: Investor | undefined;

  private TAX_BRACKETS = [
    {lower: 0, upper: 11294, rate: 0},
    {lower: 11294, upper: 28797, rate: 11},
    {lower: 27478, upper: 82341, rate: 30},
    {lower: 78570, upper: 177105, rate: 41},
    {lower: 177106, upper: Infinity, rate: 45},
  ];


  constructor(
    private http: HttpClient,
    private userService: UserService,
    private investorService: InvestorService,) {
  }

  getSimulations(): Observable<Simulation[]> {
    return this.http.get<Simulation[]>(this.apiUrl);
  }

  createSimulation(simulation: SimulationCreate): Observable<Simulation> {
    return this.http
      .post<Simulation>(this.apiUrl, simulation)
      .pipe(
        tap((response) => {
          this.simulationSubject.next(response);
        }),
        catchError((error) => {
          console.error('Error creating simulation:', error);
          return throwError(() => error);
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
        id: {country: countryName},
        countryPercentage:
          Math.round((total / simulationCreation.totalInvestment) * 100 * 100) /
          100,
      })
    );

    const sectors = Array.from(sectorInvestments.entries()).map(
      ([sectorName, total]) => ({
        id: {name: sectorName},
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
          grossRevenue: this.calculateGrossRevenue(scpiSimulation),
          netRevenue: this.calculateNetRevenue(scpiSimulation, locations),
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


  private calculateGrossRevenue(scpi: ScpiSimulation): number {
    return (scpi.partPrice * scpi.numberPart) * ((scpi.statYear / 100) / 12);
  }

  private calculateNetRevenue(scpi: ScpiSimulation, locations: {
    countryPercentage: number;
    id: { country: string }
  }[]): number {

    if (!this.investor) {
      console.warn("Informations de l'investisseur non renseignées.");
      return 0;
    }
    let status = this.investor.maritalStatus;
    let nbEnfants = Number(this.investor.numberOfChildren) || 0;
    let revenuImposable = this.investor.annualIncome || 0;
    let parts = (status === "marié") ? 2 : 1;
    let grossRevenue = this.calculateGrossRevenue(scpi);

    if (isNaN(nbEnfants) || nbEnfants < 0) {
      console.warn("Nombre d'enfants invalide, valeur par défaut utilisée (0).");
      nbEnfants = 0;
    }

    if (nbEnfants >= 1) parts += 0.5;
    if (nbEnfants >= 2) parts += 0.5;
    if (nbEnfants > 2) parts += nbEnfants - 2;

    console.debug(`Nombre total de parts fiscales : ${parts}`);

    let quotient = revenuImposable / parts;
    console.debug(`Quotient familial : ${quotient}`);

    let impotParPart = 0;
    let tauxMarginal = 0;

    if (Array.isArray(this.TAX_BRACKETS) && this.TAX_BRACKETS.length > 0) {
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
    } else {
      console.error("TAX_BRACKETS est invalide ou vide.");
    }

    let impotTotal = impotParPart * parts;
    let tauxMoyen = revenuImposable > 0 ? (impotTotal / revenuImposable) * 100 : 0; // Éviter division par zéro

    let totalTax = +impotTotal.toFixed(2);
    tauxMoyen = +tauxMoyen.toFixed(2);
    let TMI = tauxMarginal;

    console.debug(`Impôt total : ${totalTax}`);
    console.debug(`Taux moyen d'imposition TM: ${tauxMoyen}%`);
    console.debug(`Taux marginal d'imposition TMI: ${TMI}%`);

    let pourcentageFrance = 0;
    let pourcentageEurope = 0;

    locations.forEach(location => {
      if (location.id.country === "France") {
        pourcentageFrance += location.countryPercentage;
      } else {
        pourcentageEurope += location.countryPercentage;
      }
    });
    console.debug("localistion:", locations )
    console.debug("Pourcentage France :", pourcentageFrance);
    console.debug("Somme des autres pourcentages :", pourcentageEurope);

    let netRevenueFrance = (grossRevenue * (pourcentageFrance / 100)) * (1 - (TMI + 17.2) / 100);
    let netRevenueEurope = (grossRevenue * (pourcentageEurope / 100)) * (1 - (TMI - tauxMoyen) / 100);
    let totalNetRevenue = netRevenueFrance + netRevenueEurope;

    console.debug(`Revenu Net France : ${netRevenueFrance.toFixed(2)}`);
    console.debug(`Revenu Net Europe : ${netRevenueEurope.toFixed(2)}`);
    console.debug(`Revenu Net Total : ${totalNetRevenue.toFixed(2)}`);

    return totalNetRevenue;
  }

  public getInvestorInfos(): void {
    const user = this.userService.getUser();
    if (!user || !user.email) {
      console.warn("Utilisateur non connecté ou email manquant.");
      return;
    }

    this.investorService.getInvestorByEmail(user.email).subscribe({
      next: (investorData) => {
        this.investor = investorData;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'investisseur", err);
      },
    });
  }
}
