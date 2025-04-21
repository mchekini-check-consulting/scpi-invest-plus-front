import { Location } from "./Location";
import { StatYearModel } from "./scpi.model";
import { Sector } from "./Sector";


export interface Scpi {
  scpiId: number;
  numberPart: number;
  partPrice: number;
  rising: number;
  duree: number;
  dureePercentage: number;
  propertyType: string;
}


export interface SimulationCreate {
  name: string;
  simulationDate: string;
  investorEmail?: string;
  scpis: Scpi[];
}


export interface Simulation {
  id: number;
  name: string;
  simulationDate: string;
  monthlyIncome: number;
  totalInvestment: number;
  scpiSimulations: ScpiSimulation[];
  locations: Location[];
  sectors: Sector[];
  years: number[];
  distributionYear: number[];
}

export interface ScpiSimulation {
  scpiId: number;
  numberPart: number;
  partPrice: number;
  rising: number;
  duree: number;
  dureePercentage: number;
  propertyType: string;
  scpiName: string;
  statYear : number
  statYears : StatYearModel[],
  netRevenue: number,
  grossRevenue:number,
  locations: Location[];
  sectors: Sector[];
}


