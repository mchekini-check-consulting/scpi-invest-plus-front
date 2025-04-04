import { ScpiIndexModel } from "@/core/model/scpi.model";

export const formatLocation = (locations?: ScpiIndexModel["locations"]): string => {
  if (!locations || locations.length === 0) return "N/A";


  const lastLocation = locations[locations.length - 1];

 
  return `${lastLocation.country ?? "N/A"} - ${
    lastLocation.countryPercentage !== undefined
      ? `${lastLocation.countryPercentage}%`
      : "N/A%"
  }`;
};

export const formatSector = (sectors?: ScpiIndexModel["sectors"]): string => {
  if (!sectors || sectors.length === 0) return "N/A";


  const lastSector = sectors[sectors.length - 1];


  return `${lastSector.name ?? "N/A"} - ${
    lastSector.sectorPercentage !== undefined
      ? `${lastSector.sectorPercentage}%`
      : "N/A%"
  }`;
};

export const formatDistributionRate = (distributionRate?: number): string => {
  return `Rendement - ${
    distributionRate !== undefined ? distributionRate + "%" : "N/A"
  }`;
};

export const formatMinimum = (minimumSubscription?: number): string => {
  return `Minimum - ${
    minimumSubscription !== undefined ? minimumSubscription + " €" : "N/A"
  }`;
};
