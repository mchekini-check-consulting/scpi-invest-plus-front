export class YearStat {
    yearStat: number;
    scpiId: number;

    constructor(year: number, scpiId: number) {
        this.yearStat = year;
        this.scpiId = scpiId;
    }
}

export class StatYear {
    yearStat: YearStat;
    distributionRate: number;
    sharePrice: number;
    reconstitutionValue: number;

    constructor(yearStat: YearStat, distributionRate: number, sharePrice: number, reconstitutionValue: number) {
        this.yearStat = yearStat;
        this.distributionRate = distributionRate;
        this.sharePrice = sharePrice;
        this.reconstitutionValue = reconstitutionValue;
    }
}
