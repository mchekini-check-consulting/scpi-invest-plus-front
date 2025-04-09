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

