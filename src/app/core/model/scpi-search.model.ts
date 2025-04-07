export interface ScpiSearch {
  searchTerm?: string;
  locations?: string[];
  sectors?: string[];
  minimumSubscription?: number;
  subscriptionFees?: boolean;
  rentalFrequency?: string;
  distributionRate?: number;
}
