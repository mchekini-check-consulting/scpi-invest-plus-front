import { Sector } from "./Sector";

export interface SimulationName {
  name: string;
  simulationDate: string;
  investorEmail: string;
}


export interface Simulation {
  id: number;
  name: string;
  simulationDate: string;
  investorEmail: string;
  totalInvestment: number;
  monthlyIncome: number;
  scpiSimulations: ScpiSimulation[];
  locations: Location[];
  sectors: Sector[];
}

export interface ScpiSimulation {
  simulationId: number;
  scpiId: number;
  numberPart: number;
  partPrice: number;
  rising: number;
  duree: number | null;
  dureePercentage: number | null;
  propertyType: string;
  scpiName?: string;
  grossRevenue?: number;
  netRevenue?: number;
}



