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
  scpiSimulations: ScpiSimulation[];
}

export interface ScpiSimulation {
  simulationId: number;
  scpiId: number;
  numberPart: number;
  partPrice: number;
  rising: number;
  duree: number;
  dureePercentage: number;
  propertyType: string;
}

