import React from 'react';
import { OffsiteOperations, SelectedExtensions, GeographicalLimit } from '../types';
import { GEOGRAPHICAL_LIMITS } from '../constants';
import { HelpCircle, ShieldCheck, Briefcase, Users, Coins, Map, CheckCircle2, ChevronDown } from 'lucide-react';

interface OffsiteStepProps {
  offsite: OffsiteOperations;
  extensions: SelectedExtensions;
  onOffsiteChange: (offsite: OffsiteOperations) => void;
  onExtensionsChange: (extensions: SelectedExtensions) => void;
  errors: Record<string, string>;
}

export const OffsiteStep: React.FC<OffsiteStepProps> = ({
  offsite,
  extensions,
  onOffsiteChange,
  onExtensionsChange,
  errors,
}) => {
  const handleOffsiteChange = (key: keyof OffsiteOperations, value: any) => {
    onOffsiteChange({
      ...offsite,
      [key]: value,
    });
  };

  const toggleExtension = (key: keyof SelectedExtensions) => {
    onExtensionsChange({
      ...extensions,
      [key]: !extensions[key],
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. Off-site operations question */}
      <div className="space-y-4">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-green" />
            Off-Site Operations
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Indicate if you perform third-party site projects, installations, deliveries, or contract work outside your registered premises.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-0.5">
            <label className="text-sm font-semibold text-slate-800">
              Do you have operations outside the registered address you want to cover?
            </label>
            <p className="text-xs text-slate-500">
              Includes off-site service calls, client office visits, installations, and subcontracted projects.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="offsiteCover"
                checked={offsite.coverRequired === 'no'}
                onChange={() => handleOffsiteChange('coverRequired', 'no')}
                className="w-4 h-4 text-brand-green focus:ring-brand-green border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">No</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="offsiteCover"
                checked={offsite.coverRequired === 'yes'}
                onChange={() => handleOffsiteChange('coverRequired', 'yes')}
                className="w-4 h-4 text-brand-green focus:ring-brand-green border-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">Yes</span>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Offsite fields */}
      {offsite.coverRequired === 'yes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/40 p-5 rounded-2xl border border-slate-100">
          {/* Location of operations */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Off-site Operations Locations <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Client sites across UAE, or dynamic projects"
              value={offsite.location || ''}
              onChange={(e) => handleOffsiteChange('location', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm transition-all outline-none bg-white
                \${
                  errors.offsite_location
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                    : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
                }`}
            />
            {errors.offsite_location && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.offsite_location}</p>
            )}
          </div>

          {/* Overall limit of indemnity */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-slate-400" />
              Overall Limit of Indemnity Required <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-semibold text-slate-400">AED</span>
              <input
                type="text"
                placeholder="e.g. 10,000,000"
                value={offsite.limitOfIndemnity || ''}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9]/g, '');
                  const formatted = clean ? Number(clean).toLocaleString('en-US') : '';
                  handleOffsiteChange('limitOfIndemnity', formatted);
                }}
                className={`w-full pl-11 pr-3 py-2 rounded-lg border text-sm transition-all outline-none bg-white
                  \${
                    errors.offsite_limitOfIndemnity
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                      : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
                  }`}
              />
            </div>
            {errors.offsite_limitOfIndemnity && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.offsite_limitOfIndemnity}</p>
            )}
          </div>

          {/* Geographical limit */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Map className="w-3.5 h-3.5 text-slate-400" />
              Geographical Limit Required <span className="text-rose-500 font-bold">*</span>
            </label>
            <select
              value={offsite.geographicalLimit || 'UAE'}
              onChange={(e) => handleOffsiteChange('geographicalLimit', e.target.value as GeographicalLimit)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm transition-all outline-none bg-white cursor-pointer focus:border-brand-green focus:ring-4 focus:ring-brand-green-light"
            >
              {GEOGRAPHICAL_LIMITS.map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </div>

          {/* Employees doing manual work */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Employees Doing Manual Work? <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="flex gap-4 py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="manualWork"
                  checked={offsite.manualWorkEmployees === 'no'}
                  onChange={() => handleOffsiteChange('manualWorkEmployees', 'no')}
                  className="w-4 h-4 text-brand-green focus:ring-brand-green border-slate-300"
                />
                <span className="text-sm font-medium text-slate-700">No</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="manualWork"
                  checked={offsite.manualWorkEmployees === 'yes'}
                  onChange={() => handleOffsiteChange('manualWorkEmployees', 'yes')}
                  className="w-4 h-4 text-brand-green focus:ring-brand-green border-slate-300"
                />
                <span className="text-sm font-medium text-slate-700">Yes</span>
              </label>
            </div>
            {offsite.manualWorkEmployees === 'yes' && (
              <p className="text-[10px] text-brand-green font-medium">
                Note: Premium will adjust for manual risk exposures such as heights, tools, or machinery.
              </p>
            )}
          </div>

          {/* Annual Turnover (split per country if outside UAE cover is needed) */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Annual Turnover <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-semibold text-slate-400">AED</span>
              <input
                type="text"
                placeholder="Estimated yearly sales / revenue"
                value={offsite.annualTurnover || ''}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9]/g, '');
                  const formatted = clean ? Number(clean).toLocaleString('en-US') : '';
                  handleOffsiteChange('annualTurnover', formatted);
                }}
                className={`w-full pl-11 pr-3 py-2 rounded-lg border text-sm transition-all outline-none bg-white
                  \${
                    errors.offsite_annualTurnover
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                      : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
                  }`}
              />
            </div>
            {errors.offsite_annualTurnover && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.offsite_annualTurnover}</p>
            )}
          </div>

          {/* If geographical limit is NOT UAE, ask for turnover split */}
          {offsite.geographicalLimit && offsite.geographicalLimit !== 'UAE' && (
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600">
                Annual Turnover Split per Country <span className="text-rose-500 font-bold">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. UAE: AED 3,000,000 | Saudi Arabia: AED 1,500,000 | Oman: AED 500,000"
                value={offsite.turnoverSplitDetails || ''}
                onChange={(e) => handleOffsiteChange('turnoverSplitDetails', e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border text-xs transition-all outline-none bg-white resize-none
                  \${
                    errors.offsite_turnoverSplitDetails
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                      : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
                  }`}
              />
              {errors.offsite_turnoverSplitDetails && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.offsite_turnoverSplitDetails}</p>
              )}
            </div>
          )}

          {/* Estimated Number of Projects/Contracts */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">
              Estimated Number of Projects / Contracts <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="number"
              min="0"
              placeholder="e.g. 15"
              value={offsite.estimatedProjects || ''}
              onChange={(e) => handleOffsiteChange('estimatedProjects', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm transition-all outline-none bg-white
                \${
                  errors.offsite_estimatedProjects
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                    : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
                }`}
            />
            {errors.offsite_estimatedProjects && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.offsite_estimatedProjects}</p>
            )}
          </div>

          {/* Number of employees */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Total Number of Employees <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 45"
              value={offsite.numberOfEmployees || ''}
              onChange={(e) => handleOffsiteChange('numberOfEmployees', e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border text-sm transition-all outline-none bg-white
                \${
                  errors.offsite_numberOfEmployees
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                    : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
                }`}
            />
            {errors.offsite_numberOfEmployees && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.offsite_numberOfEmployees}</p>
            )}
          </div>

          {/* Subcontracted operations */}
          <div className="md:col-span-2 border-t border-slate-200/50 pt-4 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-0.5">
                <label className="text-xs font-semibold text-slate-700">
                  Is any of your off-site work subcontracted?
                </label>
                <p className="text-[11px] text-slate-500">
                  Select yes if you assign works to independent third-party vendors or freelancers.
                </p>
              </div>
              <div className="flex gap-4 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="subcontracted"
                    checked={offsite.subcontractedWork === 'no'}
                    onChange={() => handleOffsiteChange('subcontractedWork', 'no')}
                    className="w-4 h-4 text-brand-green focus:ring-brand-green border-slate-300"
                  />
                  <span className="text-sm font-medium text-slate-700">No</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="subcontracted"
                    checked={offsite.subcontractedWork === 'yes'}
                    onChange={() => handleOffsiteChange('subcontractedWork', 'yes')}
                    className="w-4 h-4 text-brand-green focus:ring-brand-green border-slate-300"
                  />
                  <span className="text-sm font-medium text-slate-700">Yes</span>
                </label>
              </div>
            </div>

            {offsite.subcontractedWork === 'yes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-white p-4 rounded-xl border border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    Subcontracted Services <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Electrical wiring, plumbing, HVAC install"
                    value={offsite.subcontractedServices || ''}
                    onChange={(e) => handleOffsiteChange('subcontractedServices', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs transition-all outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green-light bg-slate-50/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">
                    % of Subcontracted Work on Turnover <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g. 15"
                      value={offsite.subcontractedPercentage || ''}
                      onChange={(e) => handleOffsiteChange('subcontractedPercentage', e.target.value)}
                      className="w-full pr-8 pl-3 py-2 rounded-lg border border-slate-200 text-xs transition-all outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green-light bg-slate-50/30"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Policy Extensions Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-green" />
            Liability Extensions Required
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Select additional coverage extensions for specialized assets or principal protection.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Extension A */}
          <div
            onClick={() => toggleExtension('propertyBeingWorkedUpon')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-4 select-none
              \${
                extensions.propertyBeingWorkedUpon
                  ? 'border-brand-green bg-brand-green-light/20 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/40'
              }`}
          >
            <div className="pt-0.5">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border transition-all
                  \${
                    extensions.propertyBeingWorkedUpon
                      ? 'border-brand-green bg-brand-green text-white'
                      : 'border-slate-300 bg-white'
                  }`}
              >
                {extensions.propertyBeingWorkedUpon && <CheckCircle2 className="w-4 h-4 text-white fill-brand-green" />}
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800 block">
                A. Property being worked upon / Contract works and materials
              </span>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Covers liability for physical damage caused directly to third-party contract materials or structural projects on which your employees are actively performing labor.
              </p>
            </div>
          </div>

          {/* Extension B */}
          <div
            onClick={() => toggleExtension('propertyUnderCareCustodyControl')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-4 select-none
              \${
                extensions.propertyUnderCareCustodyControl
                  ? 'border-brand-green bg-brand-green-light/20 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/40'
              }`}
          >
            <div className="pt-0.5">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border transition-all
                  \${
                    extensions.propertyUnderCareCustodyControl
                      ? 'border-brand-green bg-brand-green text-white'
                      : 'border-slate-300 bg-white'
                  }`}
              >
                {extensions.propertyUnderCareCustodyControl && <CheckCircle2 className="w-4 h-4 text-white fill-brand-green" />}
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800 block">
                B. Property under care, custody and control
              </span>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Extends coverage to physical damage or loss occurring to third-party assets left directly under your custody or supervision for maintenance, holding, or storage.
              </p>
            </div>
          </div>

          {/* Extension C */}
          <div
            onClick={() => toggleExtension('principalsExistingProperty')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-4 select-none
              \${
                extensions.principalsExistingProperty
                  ? 'border-brand-green bg-brand-green-light/20 shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/40'
              }`}
          >
            <div className="pt-0.5">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border transition-all
                  \${
                    extensions.principalsExistingProperty
                      ? 'border-brand-green bg-brand-green text-white'
                      : 'border-slate-300 bg-white'
                  }`}
              >
                {extensions.principalsExistingProperty && <CheckCircle2 className="w-4 h-4 text-white fill-brand-green" />}
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-slate-800 block">
                C. Principals existing and surrounding property
              </span>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Protects against accidental damages to preexisting structural facilities or adjacent lands owned by the client/principal on whose site your company is working.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
