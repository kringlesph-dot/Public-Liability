/**
 * Types and interfaces for the Public Liability Insurance Application
 */

export type OccupancyType =
  | 'Office - Warehouse Location'
  | 'Office - Building Location'
  | 'Clinics'
  | 'Restaurant - Alcohol, Shisha, BBQ'
  | 'Retail Shop (Excludes Jewelry)'
  | 'Salon/Barbershop'
  | 'Warehouse - Direct Referral'
  | 'Educational Centers'
  | 'Kiosk (Indoor)'
  | 'Kiosk (Outdoor)'
  | 'Others';

export type GeographicalLimit =
  | 'UAE'
  | 'GCC'
  | 'Worldwide inc. US & Canada'
  | 'Worldwide excl. US and Canada';

export interface LocationDetail {
  id: string;
  address: string;
  limitOfIndemnity: string; // stored as string for easier input handling, parsed to number/formatted
  occupancy: OccupancyType;
  occupancyOtherDetails?: string;
  claimsHistoryLast5Years: 'yes' | 'no';
  claimsDetails?: string;
}

export interface OffsiteOperations {
  coverRequired: 'yes' | 'no';
  location?: string;
  limitOfIndemnity?: string;
  geographicalLimit?: GeographicalLimit;
  manualWorkEmployees?: 'yes' | 'no';
  annualTurnover?: string;
  turnoverSplitDetails?: string; // split per country if outside UAE
  estimatedProjects?: string;
  numberOfEmployees?: string;
  subcontractedWork?: 'yes' | 'no';
  subcontractedServices?: string;
  subcontractedPercentage?: string;
}

export interface SelectedExtensions {
  propertyBeingWorkedUpon: boolean; // a. Property being worked upon/contract works and materials
  propertyUnderCareCustodyControl: boolean; // b. Property under care, custody and control
  principalsExistingProperty: boolean; // c. Principals existing and surrounding property
}

export interface CompanyInfo {
  companyName: string;
  tradeLicenseNumber: string;
  businessDescription: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export interface FileAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl?: string; // for previewing photos
}

export interface PublicLiabilityApplication {
  id: string;
  companyInfo: CompanyInfo;
  numberOfLocations: number;
  locations: LocationDetail[];
  offsiteOperations: OffsiteOperations;
  extensions: SelectedExtensions;
  attachments: {
    tradeLicense: FileAttachment | null;
    photos: FileAttachment[];
  };
  submittedAt?: string;
  status: 'draft' | 'submitted';
}
