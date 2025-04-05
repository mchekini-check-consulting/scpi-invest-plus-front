import { ScpiModel } from "@/core/model/scpi.model";

export const formatLocation = (location?: ScpiModel["location"]) => {
  if (!location) return "N/A";
  const country = location.id?.country ?? "N/A";
  const percentage =
    location.countryPercentage !== undefined
      ? `${location.countryPercentage}%`
      : "N/A%";
  return `${country} - ${percentage}`;
};

export const formatSector = (sector?: ScpiModel["sector"]) => {
  if (!sector) return "N/A";
  const name = sector.id?.name ?? "N/A";
  const percentage =
    sector.sectorPercentage !== undefined ? `${sector.sectorPercentage}%` : "";
  return `${name} - ${percentage}`;
};

export const formatDistributionRate = (statYear?: ScpiModel["statYear"]) => {
  const distributionRate = statYear?.distributionRate;
  return `Rendement - ${
    distributionRate !== undefined ? distributionRate + "%" : "N/A"
  }`;
};

export const formatMinimum = (minimumSubscription?: number) => {
  return `Minimum - ${
    minimumSubscription !== undefined ? minimumSubscription + " €" : "N/A"
  }`;
};
