import { OccupancyType, GeographicalLimit, LocationDetail, PublicLiabilityApplication } from './types';

export const OCCUPANCY_OPTIONS: OccupancyType[] = [
  'Office - Building Location',
  'Office - Warehouse Location',
  'Clinics',
  'Restaurant - Alcohol, Shisha, BBQ',
  'Retail Shop (Excludes Jewelry)',
  'Salon/Barbershop',
  'Warehouse - Direct Referral',
  'Educational Centers',
  'Kiosk (Indoor)',
  'Kiosk (Outdoor)',
  'Others',
];

export const GEOGRAPHICAL_LIMITS: GeographicalLimit[] = [
  'UAE',
  'GCC',
  'Worldwide excl. US and Canada',
  'Worldwide inc. US & Canada',
];

export const createEmptyLocation = (id: string): LocationDetail => ({
  id,
  address: '',
  limitOfIndemnity: '',
  occupancy: 'Office - Building Location',
  claimsHistoryLast5Years: 'no',
});

export const createEmptyApplication = (): PublicLiabilityApplication => ({
  id: `PLA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  companyInfo: {
    companyName: '',
    tradeLicenseNumber: '',
    businessDescription: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
  },
  numberOfLocations: 1,
  locations: [createEmptyLocation('1')],
  offsiteOperations: {
    coverRequired: 'no',
    geographicalLimit: 'UAE',
    manualWorkEmployees: 'no',
    subcontractedWork: 'no',
  },
  extensions: {
    propertyBeingWorkedUpon: false,
    propertyUnderCareCustodyControl: false,
    principalsExistingProperty: false,
  },
  attachments: {
    tradeLicense: null,
    photos: [],
  },
  status: 'draft',
});
