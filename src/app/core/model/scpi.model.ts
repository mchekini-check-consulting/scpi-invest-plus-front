export type ScpiModel = {
  id: number;
  name: string;
  minimumSubscription: number;
  location: LocationModel;
  sector: SectorModel;
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
