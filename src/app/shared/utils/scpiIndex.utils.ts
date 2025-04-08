import { ScpiIndexModel } from "@/core/model/scpi.model";


export const formatLocation = (countryDominant?: ScpiIndexModel["countryDominant"]): string => {
  if (!countryDominant) return "N/A";
  return `${countryDominant.country ?? "N/A"} - ${
    countryDominant.countryPercentage !== undefined
      ? `${countryDominant.countryPercentage}%`
      : "N/A%"
  }`;
};


export const formatSector = (sectorDominant?: ScpiIndexModel["sectorDominant"]): string => {
  if (!sectorDominant) return "N/A";
  return `${sectorDominant.name ?? "N/A"} - ${
    sectorDominant.sectorPercentage !== undefined
      ? `${sectorDominant.sectorPercentage}%`
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
