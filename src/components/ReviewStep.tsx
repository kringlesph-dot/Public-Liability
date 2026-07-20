import React, { useState } from 'react';
import { PublicLiabilityApplication } from '../types';
import {
  FileText,
  Building,
  MapPin,
  Briefcase,
  Paperclip,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  DollarSign,
  Users,
  Settings,
  PenTool,
} from 'lucide-react';

interface ReviewStepProps {
  application: PublicLiabilityApplication;
  signatureName: string;
  onSignatureChange: (name: string) => void;
  signatureDate: string;
  onSignatureDateChange: (date: string) => void;
  errors: Record<string, string>;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  application,
  signatureName,
  onSignatureChange,
  signatureDate,
  onSignatureDateChange,
  errors,
}) => {
  const { companyInfo, locations, offsiteOperations, extensions, attachments } = application;
  const [agreementChecked, setAgreementChecked] = useState(false);

  // Check if any critical section has validation errors
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-green" />
          Review & Declarations
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Verify your corporate, site, and off-site operations metrics below before adding your signature and completing submission.
        </p>
      </div>

      {/* 1. Validation Alert Box */}
      {hasErrors ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-2">
          <div className="flex gap-2 items-center">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold text-sm">Please correct validation errors before submitting:</span>
          </div>
          <ul className="list-disc pl-5 text-xs space-y-1 text-rose-700 font-medium">
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-900 flex gap-3 items-center">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <span className="font-semibold text-sm block">Validation Passed Successfully</span>
            <span className="text-xs text-green-700">All mandatory fields are filled out and meet policy criteria.</span>
          </div>
        </div>
      )}

      {/* 2. Structured Information Review */}
      <div className="space-y-6">
        {/* Company Details */}
        <div className="border border-slate-150 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-150 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-600">
            <Building className="w-4 h-4 text-slate-500" />
            Company Details
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Company Name</span>
              <span className="font-semibold text-slate-800">{companyInfo.companyName || 'Not filled'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Trade License Number</span>
              <span className="font-semibold text-slate-800">{companyInfo.tradeLicenseNumber || 'Not filled'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Contact Person</span>
              <span className="font-semibold text-slate-800">{companyInfo.contactPerson || 'Not filled'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Contact Email</span>
              <span className="font-semibold text-slate-800">{companyInfo.contactEmail || 'Not filled'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Contact Phone</span>
              <span className="font-semibold text-slate-800">{companyInfo.contactPhone || 'Not filled'}</span>
            </div>
            <div className="md:col-span-3 border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-400 block uppercase font-medium">Business Operations</span>
              <p className="text-slate-600 mt-0.5 whitespace-pre-line leading-relaxed">
                {companyInfo.businessDescription || 'Not filled'}
              </p>
            </div>
          </div>
        </div>

        {/* Covered Locations details */}
        <div className="border border-slate-155 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-150 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-600">
            <MapPin className="w-4 h-4 text-slate-500" />
            Covered Locations Risk Summary ({locations.length})
          </div>
          <div className="divide-y divide-slate-100">
            {locations.map((loc, idx) => (
              <div key={loc.id} className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-brand-green uppercase tracking-wide">
                    Location #{idx + 1}
                  </span>
                  <span className="text-xs bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold text-slate-700">
                    {loc.occupancy}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="md:col-span-2">
                    <span className="text-xs text-slate-400 block uppercase font-medium">Full Physical Address</span>
                    <span className="text-slate-800 font-medium">{loc.address || 'Not filled'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block uppercase font-medium">Limit of Indemnity Required</span>
                    <span className="font-semibold text-brand-blue">
                      {loc.limitOfIndemnity ? `${loc.limitOfIndemnity} AED` : 'Not filled'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block uppercase font-medium">Claims History (5 Yrs)</span>
                    <span
                      className={`font-semibold inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs mt-1
                        ${
                          loc.claimsHistoryLast5Years === 'yes'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : 'bg-green-50 text-green-700 border border-green-100'
                        }`}
                    >
                      {loc.claimsHistoryLast5Years === 'yes' ? 'Yes (Claims Recorded)' : 'No (Clean Record)'}
                    </span>
                  </div>
                  {loc.claimsHistoryLast5Years === 'yes' && loc.claimsDetails && (
                    <div className="md:col-span-2 bg-rose-50/40 p-3 rounded-lg border border-rose-100/50 mt-1">
                      <span className="text-[10px] font-bold text-rose-800 uppercase block">Claims Breakdown</span>
                      <p className="text-xs text-rose-900 mt-1 leading-relaxed whitespace-pre-line">
                        {loc.claimsDetails}
                      </p>
                    </div>
                  )}
                  {loc.occupancy === 'Others' && loc.occupancyOtherDetails && (
                    <div className="md:col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-xs">
                      <strong>Specific occupancy description:</strong> {loc.occupancyOtherDetails}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offsite Operations details */}
        <div className="border border-slate-150 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-150 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-600">
            <Briefcase className="w-4 h-4 text-slate-500" />
            Off-Site Operations
          </div>
          {offsiteOperations.coverRequired === 'no' ? (
            <div className="p-4 text-sm text-slate-500 italic">
              No offsite operations cover requested. Policy coverage remains restricted exclusively to the physical registered premises specified above.
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block uppercase font-medium">Scope Area Locations</span>
                <span className="font-semibold text-slate-800">{offsiteOperations.location || 'Not filled'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase font-medium">Overall Off-site Limit</span>
                <span className="font-semibold text-brand-blue">
                  {offsiteOperations.limitOfIndemnity ? `${offsiteOperations.limitOfIndemnity} AED` : 'Not filled'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase font-medium">Geographical Limit Required</span>
                <span className="font-semibold text-slate-800">{offsiteOperations.geographicalLimit}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase font-medium">Annual Business Turnover</span>
                <span className="font-semibold text-slate-800">
                  {offsiteOperations.annualTurnover ? `${offsiteOperations.annualTurnover} AED` : 'Not filled'}
                </span>
              </div>
              {offsiteOperations.geographicalLimit !== 'UAE' && offsiteOperations.turnoverSplitDetails && (
                <div className="md:col-span-2 border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400 block uppercase font-medium">Turnover Country Split Details</span>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">
                    {offsiteOperations.turnoverSplitDetails}
                  </p>
                </div>
              )}
              <div className="border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-400 block uppercase font-medium">Manual Work Employees?</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {offsiteOperations.manualWorkEmployees || 'no'}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-400 block uppercase font-medium">Estimated Contracts Count</span>
                <span className="font-semibold text-slate-800">{offsiteOperations.estimatedProjects || '0'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase font-medium">Total Employees Count</span>
                <span className="font-semibold text-slate-800">{offsiteOperations.numberOfEmployees || '0'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase font-medium">Subcontracted Work?</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {offsiteOperations.subcontractedWork || 'no'}
                </span>
              </div>
              {offsiteOperations.subcontractedWork === 'yes' && (
                <div className="md:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1.5">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">Subcontracted Services</span>
                    <span className="text-xs text-slate-700 font-medium">{offsiteOperations.subcontractedServices || 'None specified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-semibold">% of Annual Turnover</span>
                    <span className="text-xs text-slate-700 font-semibold">{offsiteOperations.subcontractedPercentage ? `${offsiteOperations.subcontractedPercentage}%` : 'None specified'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Extensions */}
        <div className="border border-slate-150 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-150 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-600">
            <Settings className="w-4 h-4 text-slate-500" />
            Selected Liability Extensions
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${extensions.propertyBeingWorkedUpon ? 'bg-green-500' : 'bg-slate-200'}`} />
              <span className={`text-sm ${extensions.propertyBeingWorkedUpon ? 'font-semibold text-slate-800' : 'text-slate-400 line-through'}`}>
                A. Property being worked upon / contract works and materials
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${extensions.propertyUnderCareCustodyControl ? 'bg-green-500' : 'bg-slate-200'}`} />
              <span className={`text-sm ${extensions.propertyUnderCareCustodyControl ? 'font-semibold text-slate-800' : 'text-slate-400 line-through'}`}>
                B. Property under care, custody and control
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${extensions.principalsExistingProperty ? 'bg-green-500' : 'bg-slate-200'}`} />
              <span className={`text-sm ${extensions.principalsExistingProperty ? 'font-semibold text-slate-800' : 'text-slate-400 line-through'}`}>
                C. Principals existing and surrounding property
              </span>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="border border-slate-150 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-150 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-600">
            <Paperclip className="w-4 h-4 text-slate-500" />
            Attachments Overview
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Trade License File</span>
              {attachments.tradeLicense ? (
                <span className="font-semibold text-green-700 flex items-center gap-1.5 mt-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {attachments.tradeLicense.name}
                </span>
              ) : (
                <span className="font-semibold text-rose-600 flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  Trade License is Missing *
                </span>
              )}
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">Location Site Photos</span>
              {attachments.photos.length > 0 ? (
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <CheckCircle className="w-4 h-4 text-brand-green" />
                  {attachments.photos.length} Photo{attachments.photos.length === 1 ? '' : 's'} Uploaded
                </span>
              ) : (
                <span className="font-medium text-slate-400 italic block mt-1">
                  No site photos attached
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Electronic Declarations and e-Signature */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
            <PenTool className="w-4 h-4 text-brand-green" />
            Insured's Declaration & Signature
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            I hereby declare that all of the details specified in this Public Liability Insurance proposal form are truthful, accurate, and completely cover our commercial activities without omitting material facts.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="declare-agree"
            type="checkbox"
            checked={agreementChecked}
            onChange={(e) => setAgreementChecked(e.target.checked)}
            className="w-4 h-4 text-brand-green focus:ring-brand-green border-slate-300 rounded mt-0.5 cursor-pointer"
          />
          <label htmlFor="declare-agree" className="text-xs font-semibold text-slate-700 leading-relaxed cursor-pointer select-none">
            I agree to the declaration statement and authorize underwriters to verify the commercial risk factors of our company. <span className="text-rose-500 font-bold">*</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 pt-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Full Name of Authorized Representative <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Connor"
              value={signatureName}
              onChange={(e) => onSignatureChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green-light bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Date of Signature <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="date"
              value={signatureDate}
              onChange={(e) => onSignatureDateChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green-light bg-white"
            />
          </div>
        </div>

        {/* Handwritten visual preview of signature */}
        {signatureName.trim() && agreementChecked && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center select-none shadow-inner">
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider mb-1">
              Authorized Digital Signature Preview
            </span>
            <div className="font-serif italic text-3xl text-brand-blue font-semibold my-2 select-none tracking-wide">
              {signatureName}
            </div>
            <span className="text-[10px] text-slate-400 block border-t border-slate-100 pt-1">
              IP-logged electronic approval • {signatureDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
