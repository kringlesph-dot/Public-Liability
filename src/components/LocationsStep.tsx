import React from 'react';
import { LocationDetail, OccupancyType } from '../types';
import { OCCUPANCY_OPTIONS, createEmptyLocation } from '../constants';
import { MapPin, Coins, ClipboardCheck, AlertTriangle, HelpCircle, Plus, Trash2 } from 'lucide-react';

interface LocationsStepProps {
  numberOfLocations: number;
  locations: LocationDetail[];
  onLocationsChange: (num: number, locations: LocationDetail[]) => void;
  errors: Record<string, any>;
}

export const LocationsStep: React.FC<LocationsStepProps> = ({
  numberOfLocations,
  locations,
  onLocationsChange,
  errors,
}) => {
  const handleNumChange = (newNum: number) => {
    let updatedList = [...locations];
    if (newNum > locations.length) {
      // Add empty elements
      for (let i = locations.length; i < newNum; i++) {
        updatedList.push(createEmptyLocation((i + 1).toString()));
      }
    } else if (newNum < locations.length) {
      // Keep first newNum elements
      updatedList = updatedList.slice(0, newNum);
    }
    onLocationsChange(newNum, updatedList);
  };

  const handleLocationChange = (index: number, key: keyof LocationDetail, value: any) => {
    const updatedList = locations.map((loc, idx) => {
      if (idx === index) {
        return {
          ...loc,
          [key]: value,
        };
      }
      return loc;
    });
    onLocationsChange(numberOfLocations, updatedList);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <MapPin className="w-5 h-5 text-brand-green" />
          Location Risk Assessment
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Specify risk details and limits required for each business location to be covered under the Public Liability policy.
        </p>
      </div>

      {/* Number of locations dropdown */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-0.5">
          <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            Number of Locations to Cover
          </label>
          <p className="text-xs text-slate-500">
            Select how many physical corporate addresses require direct coverage.
          </p>
        </div>
        <select
          value={numberOfLocations}
          onChange={(e) => handleNumChange(parseInt(e.target.value, 10))}
          className="bg-white border border-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm font-medium outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green-light transition-all cursor-pointer w-full sm:w-48"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'Location' : 'Locations'}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic location details fields */}
      <div className="space-y-8">
        {locations.map((loc, idx) => {
          const locErrors = errors.locations?.[idx] || {};

          return (
            <div
              key={loc.id}
              className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white hover:border-slate-300 transition-all duration-200"
            >
              {/* Header */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 text-[10px] font-black">
                    {idx + 1}
                  </span>
                  Location Details
                </span>
                {numberOfLocations > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = locations.filter((_, i) => i !== idx);
                      onLocationsChange(numberOfLocations - 1, updated);
                    }}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded-md hover:bg-slate-100 transition-all flex items-center gap-1 text-xs font-medium"
                    title="Remove Location"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Address */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    Full Physical Address <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Unit 401, Level 4, Business Tower, Downtown, Dubai, UAE"
                    value={loc.address}
                    onChange={(e) => handleLocationChange(idx, 'address', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-all outline-none bg-white
                      \${
                        locErrors.address
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                          : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
                      }`}
                  />
                  {locErrors.address && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                      {locErrors.address}
                    </p>
                  )}
                </div>

                {/* Limit of Indemnity required (per location) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-slate-400" />
                    Limit of Indemnity Required <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-400">AED</span>
                    <input
                      type="text"
                      placeholder="e.g. 5,000,000"
                      value={loc.limitOfIndemnity}
                      onChange={(e) => {
                        // Keep only numbers and commas
                        const clean = e.target.value.replace(/[^0-9]/g, '');
                        // Add thousands separators
                        const formatted = clean ? Number(clean).toLocaleString('en-US') : '';
                        handleLocationChange(idx, 'limitOfIndemnity', formatted);
                      }}
                      className={`w-full pl-11 pr-3 py-2 rounded-lg border text-sm transition-all outline-none bg-white
                        \${
                          locErrors.limitOfIndemnity
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                            : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
                        }`}
                    />
                  </div>
                  {locErrors.limitOfIndemnity && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                      {locErrors.limitOfIndemnity}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-400">
                    Typical limits: 1,000,000 to 10,000,000 AED per location
                  </p>
                </div>

                {/* Occupancy of each location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4 text-slate-400" />
                    Location Occupancy Type <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <select
                    value={loc.occupancy}
                    onChange={(e) => handleLocationChange(idx, 'occupancy', e.target.value as OccupancyType)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm transition-all outline-none bg-white cursor-pointer focus:border-brand-green focus:ring-4 focus:ring-brand-green-light"
                  >
                    {OCCUPANCY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {/* Special Notice for Warehouses */}
                  {loc.occupancy === 'Warehouse - Direct Referral' && (
                    <div className="flex gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] mt-2 leading-relaxed">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>Direct Referral Required:</strong> Warehouses have unique liability scopes. Our underwriters will contact you for a direct physical inspection.
                      </span>
                    </div>
                  )}

                  {/* Special Note for Retail Shop */}
                  {loc.occupancy === 'Retail Shop (Excludes Jewelry)' && (
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px] mt-2">
                      <strong>Note:</strong> Coverage explicitly excludes operations involving precious metal jewelry, watches, gems or coins.
                    </div>
                  )}

                  {/* Special Note for Restaurant */}
                  {loc.occupancy === 'Restaurant - Alcohol, Shisha, BBQ' && (
                    <div className="p-2 bg-brand-blue-light border border-brand-blue-border rounded-lg text-brand-blue text-[11px] mt-2">
                      <strong>Note:</strong> Premium considers liability risks associated with alcohol, open BBQ fires, and waterpipe (shisha) smoking.
                    </div>
                  )}
                </div>

                {/* Others Specific Occupancy Input */}
                {loc.occupancy === 'Others' && (
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">
                      Specify 'Others' Occupancy Details <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Art Gallery, Private Gym, Photography Studio"
                      value={loc.occupancyOtherDetails || ''}
                      onChange={(e) => handleLocationChange(idx, 'occupancyOtherDetails', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm transition-all outline-none bg-white
                        \${
                          locErrors.occupancyOtherDetails
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                            : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
                        }`}
                    />
                    {locErrors.occupancyOtherDetails && (
                      <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                        {locErrors.occupancyOtherDetails}
                      </p>
                    )}
                  </div>
                )}

                {/* Claims History for the Last 5 years - yes or no */}
                <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-4 mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        Claims History (Last 5 Years) <span className="text-rose-500 font-bold">*</span>
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Has this location experienced any liability claims or incidents in the last 5 years?
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`claims-${idx}`}
                          checked={loc.claimsHistoryLast5Years === 'no'}
                          onChange={() => handleLocationChange(idx, 'claimsHistoryLast5Years', 'no')}
                          className="w-4 h-4 text-brand-green focus:ring-brand-green border-slate-300"
                        />
                        <span className="text-sm font-medium text-slate-700">No</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`claims-${idx}`}
                          checked={loc.claimsHistoryLast5Years === 'yes'}
                          onChange={() => handleLocationChange(idx, 'claimsHistoryLast5Years', 'yes')}
                          className="w-4 h-4 text-brand-green focus:ring-brand-green border-slate-300"
                        />
                        <span className="text-sm font-medium text-slate-700">Yes</span>
                      </label>
                    </div>
                  </div>

                  {loc.claimsHistoryLast5Years === 'yes' && (
                    <div className="space-y-1.5 border-t border-slate-200/60 pt-3">
                      <label className="text-[11px] font-semibold text-slate-600">
                        Provide Claims details (Dates, nature of claims, resolution status, and paid/outstanding amounts) <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Jan 2024: Customer slip and fall settled for AED 15,000. Safety grip mats installed immediately after."
                        value={loc.claimsDetails || ''}
                        onChange={(e) => handleLocationChange(idx, 'claimsDetails', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-xs transition-all outline-none bg-white resize-none
                          \${
                            locErrors.claimsDetails
                              ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-50/50'
                              : 'border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green-light'
                          }`}
                      />
                      {locErrors.claimsDetails && (
                        <p className="text-xs text-rose-500 flex items-center gap-1 mt-1 font-medium">
                          {locErrors.claimsDetails}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {numberOfLocations < 10 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => handleNumChange(numberOfLocations + 1)}
            className="flex items-center gap-2 text-sm text-brand-green font-semibold px-4 py-2 border border-dashed border-brand-green-border rounded-lg hover:border-brand-green hover:bg-brand-green-light/40 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Another Business Location
          </button>
        </div>
      )}
    </div>
  );
};
