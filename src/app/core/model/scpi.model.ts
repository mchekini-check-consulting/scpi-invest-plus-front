export type ScpiIndexModel = {
  id: string;
  scpiId: number;
  name: string;
  distributionRate: number;
  subscriptionFees: boolean;
  frequencyPayment: string;
  countryDominant: LocationIndexModel;
  sharePrice: number;
  sectorDominant: SectorIndexModel;
  locations: LocationIndexModel[];
  sectors: SectorIndexModel[];
  minimumSubscription: number;
  capitalization: number;
  enjoymentDelay: number;
  managementCosts: number;
  subscriptionFeesBigDecimal: number;
  matchedScore: number;
};

export type LocationIndexModel = {
  country: string;
  countryPercentage: number;
};

export type SectorIndexModel = {
  name: string;
  sectorPercentage: number;
};



export type ScpiModel = {
  id: number;
  scpiId?: number;
  name: string;
  minimumSubscription: number;
  location: LocationModel;
  sector: SectorModel;
  locations: LocationModel[];
  sectors: SectorModel[];
  cashback: number;
  statYear: StatYearModel;
  statYears: StatYearModel[];
};

export type YearStat = {
  yearStat: number;
  scpiId: number;
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

export type StatYearModel = {
  yearStat: YearStat[];
  distributionRate: number;
  sharePrice: number;
};


export interface ScpiSearch {
  name?: string;
  distributionRate?: number;
  subscriptionFees?: boolean;
  frequencyPayment?: string;
  locations?: string[];
  sectors?: string[];
  minimumSubscription?: number;
}


type StatYearsModel = {
  statYears: StatYearModel[];
  subscriptionFees: number;
}
