import { Location } from "./Location";
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
  scpiSimulations: Scpi[];
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
}


