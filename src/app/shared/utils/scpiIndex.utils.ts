import { ScpiIndexModel } from "@/core/model/scpi.model";

// Format de la location dominante
export const formatLocation = (countryDominant?: ScpiIndexModel["countryDominant"]): string => {
  if (!countryDominant) return "N/A";

  return `${countryDominant.country ?? "N/A"} - ${
    countryDominant.countryPercentage !== undefined
      ? `${countryDominant.countryPercentage}%`
      : "N/A%"
  }`;
};

// Format du secteur dominant
export const formatSector = (dominantSector?: ScpiIndexModel["dominantSector"]): string => {
  if (!dominantSector) return "N/A";

  return `${dominantSector.name ?? "N/A"} - ${
    dominantSector.sectorPercentage !== undefined
      ? `${dominantSector.sectorPercentage}%`
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
