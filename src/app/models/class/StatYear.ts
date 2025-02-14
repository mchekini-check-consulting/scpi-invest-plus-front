export class StatYear {
    year: number;
    distributionRate: number;
    sharePrice: number;
    reconstitutionValue: number;
    scpiId: number;

    constructor(year: number, distributionRate: number, sharePrice: number, reconstitutionValue: number, scpiId: number) {
        this.year = year;
        this.distributionRate = distributionRate;
        this.sharePrice = sharePrice;
        this.reconstitutionValue = reconstitutionValue;
        this.scpiId = scpiId;
    }
}