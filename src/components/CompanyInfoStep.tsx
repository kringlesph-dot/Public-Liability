import React from 'react';
import { CompanyInfo } from '../types';
import { ShieldCheck, Building2, User, Mail, Phone, FileText } from 'lucide-react';

interface CompanyInfoStepProps {
  data: CompanyInfo;
  onChange: (data: CompanyInfo) => void;
  errors: Record<string, string>;
}

export const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({ data, onChange, errors }) => {
  const handleChange = (field: keyof CompanyInfo, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-green" />
          Company Profile
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Provide your official registered corporate details to begin your Public Liability Insurance application.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            Registered Company Name <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Acme Gulf Trading LLC"
            value={data.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white
              ${
                errors.companyName
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                  : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
              }`}
          />
          {errors.companyName && (
            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">{errors.companyName}</p>
          )}
        </div>

        {/* Trade License Number */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            Trade License Number <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. TL-123456-D"
            value={data.tradeLicenseNumber}
            onChange={(e) => handleChange('tradeLicenseNumber', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white
              ${
                errors.tradeLicenseNumber
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                  : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
              }`}
          />
          {errors.tradeLicenseNumber && (
            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">{errors.tradeLicenseNumber}</p>
          )}
        </div>

        {/* Contact Person */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-400" />
            Primary Contact Person <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Sarah Connor"
            value={data.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white
              ${
                errors.contactPerson
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                  : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
              }`}
          />
          {errors.contactPerson && (
            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">{errors.contactPerson}</p>
          )}
        </div>

        {/* Contact Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-slate-400" />
            Contact Email Address <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="email"
            placeholder="e.g. contact@acmegulf.ae"
            value={data.contactEmail}
            onChange={(e) => handleChange('contactEmail', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white
              ${
                errors.contactEmail
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                  : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
              }`}
          />
          {errors.contactEmail && (
            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">{errors.contactEmail}</p>
          )}
        </div>

        {/* Contact Phone */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-slate-400" />
            Contact Phone Number <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            type="tel"
            placeholder="e.g. +971 50 123 4567"
            value={data.contactPhone}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white
              ${
                errors.contactPhone
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                  : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
              }`}
          />
          {errors.contactPhone && (
            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">{errors.contactPhone}</p>
          )}
        </div>

        {/* Business Description */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            Brief Business Operations Description <span className="text-rose-500 font-bold">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Describe your core commercial activities, services, products sold, and general operations..."
            value={data.businessDescription}
            onChange={(e) => handleChange('businessDescription', e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all outline-none bg-white resize-none
              ${
                errors.businessDescription
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                  : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
              }`}
          />
          {errors.businessDescription && (
            <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">{errors.businessDescription}</p>
          )}
          <p className="text-xs text-slate-400 font-normal">
            This information assists underwriter verification of classification codes and risks.
          </p>
        </div>
      </div>
    </div>
  );
};
