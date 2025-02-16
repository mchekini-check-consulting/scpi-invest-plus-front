import { Sector, SectorId } from "./Sector";
import { StatYear, YearStat } from "./StatYear";
import { Location, LocationId } from "./Location";
export class Details {
    id: number;
    name: string;
    subscriptionFees: number;
    managementCosts: number;
    sharePrice: number;
    reconstitutionValue: number;
    enjoymentDelay: number;
    scheduledPayment: boolean;
    frequencyPayment: string;
    distributionRate: number;
    minimumSubscription: number;
    cashback: number;
    capitalization: number;
    manager: string;
    iban: string;
    bic: string;
    advertising: string;
    statYears: StatYear[];
    locations: Location[];
    sectors: Sector[];

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.subscriptionFees = data.subscriptionFees;
        this.managementCosts = data.managementCosts;
        this.enjoymentDelay = data.enjoymentDelay;
        this.scheduledPayment = data.scheduledPayment;
        this.frequencyPayment = data.frequencyPayment;
        this.minimumSubscription = data.minimumSubscription;
        this.cashback = data.cashback;
        this.capitalization = data.capitalization;
        this.manager = data.manager;
        this.iban = data.iban;
        this.bic = data.bic;
        this.advertising = data.advertising;

        // Prendre la dernière année des statYears pour les valeurs principales
        const lastYear = data.statYears?.[0] || { year: 0, distributionRate: 0, sharePrice: 0, reconstitutionValue: 0, scpiId: 0 };
        this.distributionRate = lastYear.distributionRate;
        this.sharePrice = lastYear.sharePrice;
        this.reconstitutionValue = lastYear.reconstitutionValue;

        this.statYears = data.statYears ? data.statYears.map((stat: StatYear) => new StatYear(new YearStat(stat.yearStat.yearStat, stat.yearStat.scpiId), stat.distributionRate, stat.sharePrice, stat.reconstitutionValue)) : [];
        this.locations = data.locations ? data.locations.map((loc: Location) => new Location(new LocationId(loc.id.scpiId, loc.id.country), loc.countryPercentage)) : [];
        this.sectors = data.sectors ? data.sectors.map((sec: Sector) => new Sector(new SectorId(sec.id.scpiId, sec.id.name), sec.sectorPercentage)) : [];
    }
}