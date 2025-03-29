export interface Investments{
    id: number;
    createdAt: Date;
    typeProperty: string;
    numberYears: number;
    numberShares: number;
    totalAmount: number;
    scpiName: string,
    investmentState: string
    details?: Investments[];
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
