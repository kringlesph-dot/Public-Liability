import { PublicLiabilityApplication } from './types';

/**
 * Validates the Public Liability Application and returns a key-value record of errors
 */
export const validateApplication = (app: PublicLiabilityApplication): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Company Info Validation
  if (!app.companyInfo.companyName.trim()) {
    errors.companyName = 'Company Name is required.';
  }
  if (!app.companyInfo.tradeLicenseNumber.trim()) {
    errors.tradeLicenseNumber = 'Trade License Number is required.';
  }
  if (!app.companyInfo.contactPerson.trim()) {
    errors.contactPerson = 'Primary Contact Person is required.';
  }
  if (!app.companyInfo.contactEmail.trim()) {
    errors.contactEmail = 'Contact Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(app.companyInfo.contactEmail)) {
    errors.contactEmail = 'Contact Email format is invalid.';
  }
  if (!app.companyInfo.contactPhone.trim()) {
    errors.contactPhone = 'Contact Phone is required.';
  }
  if (!app.companyInfo.businessDescription.trim()) {
    errors.businessDescription = 'Business Description is required.';
  }

  // Locations Validation
  app.locations.forEach((loc, index) => {
    const prefix = `locations[${index}].`;
    if (!loc.address.trim()) {
      errors[`${prefix}address`] = `Address is required for Location #${index + 1}.`;
    }
    if (!loc.limitOfIndemnity.trim()) {
      errors[`${prefix}limitOfIndemnity`] = `Limit of Indemnity is required for Location #${index + 1}.`;
    }
    if (loc.occupancy === 'Others' && (!loc.occupancyOtherDetails || !loc.occupancyOtherDetails.trim())) {
      errors[`${prefix}occupancyOtherDetails`] = `Please specify 'Others' occupancy details for Location #${index + 1}.`;
    }
    if (loc.claimsHistoryLast5Years === 'yes' && (!loc.claimsDetails || !loc.claimsDetails.trim())) {
      errors[`${prefix}claimsDetails`] = `Claims details must be specified for Location #${index + 1} since Claims History is 'Yes'.`;
    }
  });

  // Offsite operations validation
  if (app.offsiteOperations.coverRequired === 'yes') {
    const ops = app.offsiteOperations;
    if (!ops.location || !ops.location.trim()) {
      errors.offsite_location = 'Off-site Location description is required.';
    }
    if (!ops.limitOfIndemnity || !ops.limitOfIndemnity.trim()) {
      errors.offsite_limitOfIndemnity = 'Overall Off-site Limit of Indemnity is required.';
    }
    if (!ops.annualTurnover || !ops.annualTurnover.trim()) {
      errors.offsite_annualTurnover = 'Annual Turnover is required for off-site cover.';
    }
    if (ops.geographicalLimit !== 'UAE' && (!ops.turnoverSplitDetails || !ops.turnoverSplitDetails.trim())) {
      errors.offsite_turnoverSplitDetails = 'Turnover country split is required for international geographical coverage.';
    }
    if (!ops.estimatedProjects || parseInt(ops.estimatedProjects, 10) < 0) {
      errors.offsite_estimatedProjects = 'Estimated projects count is required (minimum 0).';
    }
    if (!ops.numberOfEmployees || parseInt(ops.numberOfEmployees, 10) < 1) {
      errors.offsite_numberOfEmployees = 'Number of employees is required (minimum 1).';
    }
  }

  // Attachments Validation
  if (!app.attachments.tradeLicense) {
    errors.tradeLicense = 'Uploading a Trade License copy is mandatory to complete the proposal.';
  }

  return errors;
};
