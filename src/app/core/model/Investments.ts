export interface Investments {
  id: number;
  createdAt: Date;
  typeProperty: string;
  numberYears: number;
  numberShares: number;
  totalAmount: number;
  scpiName: string;
  investmentState: string;
  details?: Investments[];
  detentionYears: number;
}

export interface InvestmentPayload {
  typeProperty: "Pleine propriété" | "Nue-propriétaire" | "Usufruit";
  numberShares: number;
  totalAmount: number;
  scpiId: number;
  status: "SCHEDULED" | "STANDARD";
  investmentState: string;
  initialDeposit: number;
}


export interface InvestmentStatistics {
  montantInvesti: number;
  rendementMoyen: number;
  revenuMensuel: number;
  cashbackMontant: number;
  repGeographique?: { [key: string]: number }; 
  repSectoriel?: { [key: string]: number };
  distributionHistory?: { [key: string]: number }
}



export interface InvestmentState {
  totalInvesti: number;
  investments: {
    content: Investments[];
    totalElements: number;
  };
}
