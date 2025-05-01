import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap, throwError,} from "rxjs";
import {Scpi, ScpiSimulation, Simulation, SimulationCreate,} from "../model/Simulation";
import {Sector} from "../model/Sector";
import {Location} from "../model/Location";
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
        const locations = this.calculateLocations(simulation.scpiSimulations, simulation.totalInvestment);
        const sectors = this.calculateSectors(simulation.scpiSimulations, simulation.totalInvestment);
        const rendementParAnnee = this.calculateYearlyYields(simulation.scpiSimulations, simulation.totalInvestment);

        const years = rendementParAnnee.years;
        const distributionYear = rendementParAnnee.yield;

        const updatedSimulation: Simulation = {
          ...simulation,
          locations,
          sectors,
          years,
          distributionYear
        };
        this.simulationSubject.next(updatedSimulation);
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

    if (!currentSimulation) {
      return throwError(() => new Error("Aucune simulation sélectionnée."));
    }

    const scpiAlreadyExists = currentSimulation.scpiSimulations.some(
      (scpi: Scpi) => scpi.scpiId === scpiData.scpiId
    );

    if (scpiAlreadyExists) {
      currentSimulation.totalInvestment += scpiData.rising;
      const scpiIndex = currentSimulation.scpiSimulations.findIndex(
        (scpi: Scpi) => scpi.scpiId === scpiData.scpiId
      );
      currentSimulation.scpiSimulations[scpiIndex].rising += scpiData.rising;
      currentSimulation.scpiSimulations[scpiIndex].numberPart += scpiData.numberPart;
    }else {
      currentSimulation.totalInvestment += scpiData.rising;
      currentSimulation.scpiSimulations.push(scpiData);

      currentSimulation.locations = [
        ...currentSimulation.locations,
        ...locations,
      ];

      currentSimulation.sectors = [...currentSimulation.sectors, ...sectors];
      this.simulationSubject.next(currentSimulation);
    }


    return of(currentSimulation);
  }


  calculateSimulationResults(simulationCreation: Simulation): void {
    const scpiSimulations = simulationCreation.scpiSimulations;
    if (!scpiSimulations || scpiSimulations.length === 0) {
      console.warn("Aucune SCPI simulation trouvée.");
      return;
    }
    let monthlyIncome = 0;
    scpiSimulations.forEach((scpi: ScpiSimulation) => {
      const rate = scpi.statYear;
      const investedAmount = scpi.rising;
      monthlyIncome += investedAmount * (rate / 100);
    });
    const locations = this.calculateLocations(scpiSimulations, simulationCreation.totalInvestment);
    const sectors = this.calculateSectors(scpiSimulations, simulationCreation.totalInvestment);
    const rendementParAnnee = this.calculateYearlyYields(scpiSimulations, simulationCreation.totalInvestment);
    const years = rendementParAnnee.years;
    const distributionYear = rendementParAnnee.yield;
    const simulationResult = {
      name: simulationCreation.name,
      simulationDate: new Date().toISOString().split("T")[0],
      monthlyIncome,
      totalInvestment: simulationCreation.totalInvestment,
      scpiSimulations: scpiSimulations.map((scpi: ScpiSimulation) => ({
        scpiId: scpi.scpiId,
        numberPart: scpi.numberPart,
        statYear: scpi.statYear,
        statYears: scpi.statYears,
        partPrice: scpi.partPrice,
        rising: scpi.rising,
        duree: scpi.duree,
        dureePercentage: scpi.dureePercentage,
        grossRevenue: this.calculateGrossRevenue(scpi),
        netRevenue: this.calculateNetRevenue(scpi, locations),
        propertyType: scpi.propertyType,
        scpiName: scpi.scpiName,
        locations: [...locations],
        sectors: [...sectors],
      })),
      locations,
      sectors,
      years,
      distributionYear,

    };

    this.simulationSubject.next(simulationResult);
  }


  private calculateYearlyYields(scpiSimulations: any[],totalInvestment: number): { years: number[]; yield: number[] } {
    const rendementParAnnee = new Map<number, { total: number, poidsTotal: number }>();
    if (totalInvestment === 0) {
      console.warn("Investissement total nul.");
      return { years: [], yield: [] };
    }
    scpiSimulations.forEach((scpi) => {
      const poids = scpi.rising / totalInvestment;

      if (!Array.isArray(scpi.statYears)) return;

      scpi.statYears.forEach((stat: any) => {
        const year = typeof stat.yearStat === "object" ? stat.yearStat.yearStat : stat.yearStat;
        const rendement = stat.distributionRate;
        if (year == null || rendement == null) return;

        const rendementPondere = rendement * poids;

        if (!rendementParAnnee.has(year)) {
          rendementParAnnee.set(year, { total: 0, poidsTotal: 0 });
        }

        const data = rendementParAnnee.get(year)!;
        data.total += rendementPondere;
        data.poidsTotal += poids;
      });
    });

    const sortedEntries = Array.from(rendementParAnnee.entries()).sort(([a], [b]) => a - b);

    const years: number[] = [];
    const yieldArray: number[] = [];

    for (const [year, data] of sortedEntries) {
      const moyenne = data.total / data.poidsTotal;
      years.push(year);
      yieldArray.push(Math.round(moyenne * 100) / 100);
    }

    return {
      years,
      yield: yieldArray
    };
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
    console.debug("localistion:", locations)
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

    this.investorService.getInvestorByEmail().subscribe({
      next: (investorData) => {
        this.investor = investorData;


      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'investisseur", err);
      },
    });
  }

  private calculateLocations(scpiSimulations: ScpiSimulation[], totalInvestment: number): any[] {
    const countryInvestments: Map<string, number> = new Map();

    scpiSimulations.forEach((scpiSimulation) => {
      const investedAmount = scpiSimulation.rising;

      if (scpiSimulation?.locations && Array.isArray(scpiSimulation.locations)) {
        scpiSimulation.locations.forEach((location) => {
          const countryName = location.id.country;
          const countryPercentage = location.countryPercentage;

          const investedAmountInCountry = (investedAmount * countryPercentage) / 100;
          countryInvestments.set(
            countryName,
            (countryInvestments.get(countryName) || 0) + investedAmountInCountry
          );
        });
      }
    });

    return Array.from(countryInvestments.entries()).map(([countryName, total]) => ({
      id: {country: countryName},
      countryPercentage: Math.round((total / totalInvestment) * 10000) / 100,
    }));
  }

  private calculateSectors(scpiSimulations: ScpiSimulation[], totalInvestment: number): any[] {
    const sectorInvestments: Map<string, number> = new Map();

    scpiSimulations.forEach((scpiSimulation) => {
      const investedAmount = scpiSimulation.rising;

      scpiSimulation.sectors.forEach((sector) => {
        const sectorName = sector.id.name;
        const sectorPercentage = sector.sectorPercentage;

        const investedAmountInSector = (investedAmount * sectorPercentage) / 100;
        sectorInvestments.set(
          sectorName,
          (sectorInvestments.get(sectorName) || 0) + investedAmountInSector
        );
      });
    });

    return Array.from(sectorInvestments.entries()).map(([sectorName, total]) => ({
      id: {name: sectorName},
      sectorPercentage: Math.round((total / totalInvestment) * 10000) / 100,
    }));
  }


}
