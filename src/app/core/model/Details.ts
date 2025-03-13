import { Sector, SectorId } from "./Sector";
import { StatYear, YearStat } from "./StatYear";
import { Location, LocationId } from "./Location";
export interface Details {
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
    statYear: StatYear;
    locations: Location[];
    sectors: Sector[];


}
