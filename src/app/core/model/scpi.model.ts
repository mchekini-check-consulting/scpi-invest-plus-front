export type ScpiIndexModel = {
  id: string;
  name: string;
  distributionRate: number;
  subscriptionFees: boolean;
  frequencyPayment: string;
  countryDominant: LocationIndexModel;
  sectorDominant: SectorIndexModel;
  locations: LocationIndexModel[];
  sectors: SectorIndexModel[];
  minimumSubscription: number;
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
  name: string;
  minimumSubscription: number;
  location: LocationModel;
  sector: SectorModel;
  locations: LocationModel[];
  sectors: SectorModel[];
  statYear: StatYearModel;
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
