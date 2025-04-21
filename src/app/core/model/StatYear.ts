export class YearStat {
    yearStat: number;
    scpiId: number;

    constructor(year: number, scpiId: number) {
        this.yearStat = year;
        this.scpiId = scpiId;
    }
}

export interface StatYear {
    yearStat: YearStat;
    distributionRate: number;
    sharePrice: number;
    reconstitutionValue: number;


}
