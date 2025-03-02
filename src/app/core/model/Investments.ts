import { ScpiModel } from "./scpi.model";

export interface Investments{
    id: number;
    numberShares: number;
    totalAmount: number;
    scpiName: ScpiModel,
    investmentState: string
}

