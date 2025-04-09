export type ScpiModel = {
  id: number;
  name: string;
  minimumSubscription: number;
  location: LocationModel;
  sector: SectorModel;
  cashback: number;
  statYear: StatYearModel;
  statYears: StatYearsModel[];

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


type StatYearsModel = {
  statYears: StatYearModel[];
  subscriptionFees: number;
}
