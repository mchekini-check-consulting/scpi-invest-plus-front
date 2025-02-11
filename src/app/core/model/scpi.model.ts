export type ScpiModel = {
  id: number;
  name: string;
  minimumSubscription: number;
  manager: string;
  capitalization: number;
  subscriptionFees: number;
  managementCosts: number;
  enjoymentDelay: number;
  iban: string;
  bic: string;
  scheduledPayment: boolean;
  cashback: number;
  advertising: string;
  locations: LocationModel[];
  sectors: SectorModel[];
  statYears: StatYearModel[];
};

type LocationModel = {
  countryPercentage: number;
  id: {
    country: string;
    scpiId: number;
  };
};

type SectorModel = {
  sectorPercentage: number;
  id: {
    name: string;
    scpiId: number;
  };
};

type StatYearModel = {
  distributionRate: number;
  sharePrice: number;
  reconstitutionValue: number;
  id: {
    yearStat: number;
    scpiId: number;
  };
};
