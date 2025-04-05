import { ScpiModel } from "./scpi.model";

export interface Investments {
  id: number;
  numberShares: number;
  totalAmount: number;
  scpiName: ScpiModel;
  investmentState: string;
}

export interface InvestmentPayload {
  typeProperty: "Pleine propriété" | "Nue-propriétaire" | "Usufruit";
  numberShares: number;
  totalAmount: number;
  scpiId: number;
  status: "SCHEDULED" | "STANDARD";
  investmentState: string;
}
