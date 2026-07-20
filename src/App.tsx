import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Building,
  MapPin,
  Briefcase,
  Paperclip,
  CheckCircle,
  Printer,
  ChevronLeft,
  ChevronRight,
  Save,
  Check,
  Undo2,
  Eye,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Award,
} from 'lucide-react';
import { createEmptyApplication } from './constants';
import { PublicLiabilityApplication, LocationDetail, OffsiteOperations, SelectedExtensions, FileAttachment } from './types';
import { CompanyInfoStep } from './components/CompanyInfoStep';
import { LocationsStep } from './components/LocationsStep';
import { OffsiteStep } from './components/OffsiteStep';
import { UploadStep } from './components/UploadStep';
import { ReviewStep } from './components/ReviewStep';
import { validateApplication } from './utils';

const STEPS = [
  { id: 1, title: 'Company Details', desc: 'Corporate information' },
  { id: 2, title: 'Risk Assessment', desc: 'Location details' },
  { id: 3, title: 'Off-site Cover', desc: 'Subcontracts & extensions' },
  { id: 4, title: 'Uploads', desc: 'License & asset photos' },
  { id: 5, title: 'Review & Sign', desc: 'Final declaration' },
];

export default function App() {
  const [appState, setAppState] = useState<PublicLiabilityApplication>(() => {
    const saved = localStorage.getItem('pla_active_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse active draft', e);
      }
    }
    return createEmptyApplication();
  });

  const [submittedProposals, setSubmittedProposals] = useState<PublicLiabilityApplication[]>(() => {
    const saved = localStorage.getItem('pla_submitted_proposals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse submitted proposals', e);
      }
    }
    return [];
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [signatureName, setSignatureName] = useState('');
  const [signatureDate, setSignatureDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [activeProposalId, setActiveProposalId] = useState<string | null>(null);
  const [viewingProposal, setViewingProposal] = useState<PublicLiabilityApplication | null>(null);
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Auto-save active draft to localStorage on change
  useEffect(() => {
    localStorage.setItem('pla_active_draft', JSON.stringify(appState));
  }, [appState]);

  // Handle Toast Auto-Dismissal
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToastMessage = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleCompanyChange = (companyInfo: PublicLiabilityApplication['companyInfo']) => {
    setAppState((prev) => ({ ...prev, companyInfo }));
  };

  const handleLocationsChange = (num: number, locations: LocationDetail[]) => {
    setAppState((prev) => ({
      ...prev,
      numberOfLocations: num,
      locations,
    }));
  };

  const handleOffsiteChange = (offsiteOperations: OffsiteOperations) => {
    setAppState((prev) => ({ ...prev, offsiteOperations }));
  };

  const handleExtensionsChange = (extensions: SelectedExtensions) => {
    setAppState((prev) => ({ ...prev, extensions }));
  };

  const handleUploadTradeLicense = (file: FileAttachment | null) => {
    setAppState((prev) => ({
      ...prev,
      attachments: {
        ...prev.attachments,
        tradeLicense: file,
      },
    }));
  };

  const handleUploadPhotos = (files: FileAttachment[]) => {
    setAppState((prev) => ({
      ...prev,
      attachments: {
        ...prev.attachments,
        photos: files,
      },
    }));
  };

  const saveDraft = () => {
    localStorage.setItem('pla_active_draft', JSON.stringify(appState));
    showToastMessage('Draft progress successfully saved!', 'success');
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to start a completely fresh proposal? Current unsaved fields will be reset.')) {
      const fresh = createEmptyApplication();
      setAppState(fresh);
      setCurrentStep(1);
      setSignatureName('');
      setValidationErrors({});
      setShowSuccessState(false);
      localStorage.removeItem('pla_active_draft');
      showToastMessage('Application reset to blank template.', 'info');
    }
  };

  const handleNextStep = () => {
    // Run validation for the current step to alert users early
    const allErrors = validateApplication(appState);
    const stepErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!appState.companyInfo.companyName.trim()) stepErrors.companyName = 'Company name is required.';
      if (!appState.companyInfo.tradeLicenseNumber.trim()) stepErrors.tradeLicenseNumber = 'Trade license number is required.';
      if (!appState.companyInfo.contactPerson.trim()) stepErrors.contactPerson = 'Primary contact person is required.';
      if (!appState.companyInfo.contactEmail.trim()) stepErrors.contactEmail = 'Email address is required.';
      if (!appState.companyInfo.contactPhone.trim()) stepErrors.contactPhone = 'Phone number is required.';
      if (!appState.companyInfo.businessDescription.trim()) stepErrors.businessDescription = 'Operations description is required.';
    } else if (currentStep === 2) {
      appState.locations.forEach((loc, idx) => {
        if (!loc.address.trim()) stepErrors[`loc_${idx}_address`] = `Full address is required for Location #${idx + 1}.`;
        if (!loc.limitOfIndemnity.trim()) stepErrors[`loc_${idx}_limit`] = `Indemnity limit is required for Location #${idx + 1}.`;
        if (loc.occupancy === 'Others' && (!loc.occupancyOtherDetails || !loc.occupancyOtherDetails.trim())) {
          stepErrors[`loc_${idx}_other`] = `Please clarify 'Others' occupancy description for Location #${idx + 1}.`;
        }
        if (loc.claimsHistoryLast5Years === 'yes' && (!loc.claimsDetails || !loc.claimsDetails.trim())) {
          stepErrors[`loc_${idx}_claims`] = `Claims breakdown is mandatory for Location #${idx + 1} due to 'Yes' history flag.`;
        }
      });
    } else if (currentStep === 3) {
      if (appState.offsiteOperations.coverRequired === 'yes') {
        const ops = appState.offsiteOperations;
        if (!ops.location || !ops.location.trim()) stepErrors.offsite_loc = 'Offsite operations location is required.';
        if (!ops.limitOfIndemnity || !ops.limitOfIndemnity.trim()) stepErrors.offsite_limit = 'Overall off-site limit is required.';
        if (!ops.annualTurnover || !ops.annualTurnover.trim()) stepErrors.offsite_turnover = 'Annual company turnover is required.';
        if (ops.geographicalLimit !== 'UAE' && (!ops.turnoverSplitDetails || !ops.turnoverSplitDetails.trim())) {
          stepErrors.offsite_split = 'Turnover country split details are required for overseas coverage.';
        }
        if (!ops.estimatedProjects) stepErrors.offsite_projects = 'Estimated projects count is required.';
        if (!ops.numberOfEmployees) stepErrors.offsite_employees = 'Number of employees is required.';
      }
    } else if (currentStep === 4) {
      if (!appState.attachments.tradeLicense) {
        stepErrors.tradeLicense = 'Uploading your valid Trade License is a mandatory requirement.';
      }
    }

    if (Object.keys(stepErrors).length > 0) {
      setValidationErrors(stepErrors);
      showToastMessage('Please fill all mandatory fields to proceed.', 'error');
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors({});
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitProposal = () => {
    const allErrors = validateApplication(appState);
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      showToastMessage('Proposal form contains validation errors.', 'error');
      setCurrentStep(5); // focus on review step
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!signatureName.trim()) {
      showToastMessage('Electronic representative signature name is required.', 'error');
      return;
    }

    // Prepare submitted application
    const submittedApp: PublicLiabilityApplication = {
      ...appState,
      status: 'submitted',
      submittedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    // Update historical proposals list
    const updatedHistory = [submittedApp, ...submittedProposals];
    setSubmittedProposals(updatedHistory);
    localStorage.setItem('pla_submitted_proposals', JSON.stringify(updatedHistory));

    // Reset current active draft to clear form
    const fresh = createEmptyApplication();
    setAppState(fresh);
    localStorage.removeItem('pla_active_draft');

    // Show completion success screen
    setActiveProposalId(submittedApp.id);
    setViewingProposal(submittedApp);
    setShowSuccessState(true);
    showToastMessage('Application Proposal Submitted Successfully!', 'success');
  };

  const viewProposalDetails = (prop: PublicLiabilityApplication) => {
    setViewingProposal(prop);
    setActiveProposalId(prop.id);
    setShowSuccessState(false);
  };

  const closeProposalView = () => {
    setViewingProposal(null);
    setActiveProposalId(null);
  };

  const deleteSubmission = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this historical submission record? This is irreversible.')) {
      const filtered = submittedProposals.filter((p) => p.id !== id);
      setSubmittedProposals(filtered);
      localStorage.setItem('pla_submitted_proposals', JSON.stringify(filtered));
      if (activeProposalId === id) {
        setViewingProposal(null);
        setActiveProposalId(null);
      }
      showToastMessage('Submission record deleted.', 'info');
    }
  };

  // Quick helper to fill demo data for speedy review
  const loadDemoData = () => {
    setAppState({
      id: `PLA-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      companyInfo: {
        companyName: 'Mubadala Logistics Services LLC',
        tradeLicenseNumber: 'TL-88214-X',
        businessDescription: 'Commercial warehouse storage, sorting, local delivery, cargo dispatch, and supply chain consultancy.',
        contactPerson: 'Sultan Al Qasimi',
        contactEmail: 'sultan@mubadalalogistics.ae',
        contactPhone: '+971 52 984 3321',
      },
      numberOfLocations: 2,
      locations: [
        {
          id: '1',
          address: 'Plot 42A, Jebel Ali Industrial Area 1, JAFZA, Dubai, UAE',
          limitOfIndemnity: '5,000,000',
          occupancy: 'Office - Warehouse Location',
          claimsHistoryLast5Years: 'no',
        },
        {
          id: '2',
          address: 'Warehouse B2, Mussafah M-12, Abu Dhabi, UAE',
          limitOfIndemnity: '2,500,000',
          occupancy: 'Warehouse - Direct Referral',
          claimsHistoryLast5Years: 'yes',
          claimsDetails: 'Oct 2023: Minor structural water leakage damaged client pallets. Settled amicably with underwriter for AED 32,000. Comprehensive roof seal completed Nov 2023.',
        },
      ],
      offsiteOperations: {
        coverRequired: 'yes',
        location: 'Contracted client depots across UAE and GCC states',
        limitOfIndemnity: '5,000,000',
        geographicalLimit: 'GCC',
        manualWorkEmployees: 'yes',
        annualTurnover: '12,500,000',
        turnoverSplitDetails: 'UAE: AED 10,000,000 | Saudi Arabia: AED 2,000,000 | Oman: AED 500,000',
        estimatedProjects: '14',
        numberOfEmployees: '38',
        subcontractedWork: 'yes',
        subcontractedServices: 'Specialized cargo forklift rigging & electrical safety retrofits',
        subcontractedPercentage: '25',
      },
      extensions: {
        propertyBeingWorkedUpon: true,
        propertyUnderCareCustodyControl: true,
        principalsExistingProperty: false,
      },
      attachments: {
        tradeLicense: {
          name: 'Trade_License_Mubadala_Logistics_2026.pdf',
          size: 1424520,
          type: 'application/pdf',
        },
        photos: [],
      },
      status: 'draft',
    });
    setSignatureName('Sultan Al Qasimi');
    setCurrentStep(5);
    showToastMessage('Sample demonstration data populated.', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-green selection:text-white">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl shadow-lg border text-sm font-semibold text-white no-print
              bg-brand-navy border-brand-navy-light"
          >
            <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-brand-green' : toast.type === 'error' ? 'bg-rose-400' : 'bg-brand-orange'}`} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <header className="sticky top-0 bg-white border-b border-slate-200 z-30 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg tracking-tight font-extrabold flex items-center leading-none">
                <span className="text-brand-blue font-sans">insurance</span>
                <span className="text-brand-green font-display font-black">MARKET</span>
                <span className="text-brand-orange">.ae</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-bold tracking-wider uppercase mt-1">
                Gulf Business • Public Liability Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDemoData}
              className="text-xs font-semibold text-brand-green bg-brand-green-light border border-brand-green-border px-3 py-1.5 rounded-lg hover:bg-brand-green hover:text-white transition-all cursor-pointer"
            >
              Autofill Sample Data
            </button>
            <button
              onClick={resetForm}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-all"
              title="Clear form data"
            >
              Reset Template
            </button>
          </div>
        </div>
      </header>

      {/* Primary Layout Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Right Main Content Area */}
        <main className="min-w-0">
          
          {/* Section A: Viewing a submitted historical proposal */}
          {viewingProposal && (
            <div className="bg-white border border-slate-250 rounded-2xl shadow-sm p-6 space-y-6">
              
              {/* Success Banner if they just submitted */}
              {showSuccessState && (
                <div className="p-5 bg-green-50 border border-green-200 rounded-2xl text-center space-y-3 no-print">
                  <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-sm">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      Application Proposal Lodged Successfully
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Your commercial lines liability proposal has been generated under reference code <strong>{viewingProposal.id}</strong>. A copy is saved in your history.
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center pt-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-brand-blue hover:bg-brand-navy text-white font-semibold rounded-lg text-xs transition-all flex items-center gap-1.5 shadow"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Application
                    </button>
                    <button
                      onClick={closeProposalView}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-all"
                    >
                      Back to Form
                    </button>
                  </div>
                </div>
              )}

              {/* Document Header (Always visible, clean and corporate for printing) */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <span className="text-xs font-bold text-brand-green uppercase tracking-wider block">
                    Insurance Proposal Form
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    Public Liability Cover Definition
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Proposal Reference: <strong className="text-slate-700">{viewingProposal.id}</strong> • Lodged At: {viewingProposal.submittedAt}
                  </p>
                </div>
                <div className="flex gap-2 no-print">
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl bg-white shadow-sm transition-all text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print / PDF
                  </button>
                  <button
                    onClick={closeProposalView}
                    className="p-2 text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 rounded-xl bg-white shadow-sm transition-all text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Undo2 className="w-4 h-4" /> Exit View
                  </button>
                </div>
              </div>

              {/* Detailed Summary View */}
              <div className="space-y-6 text-sm">
                
                {/* Company & Risk Profile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 uppercase text-xs tracking-wider">
                      Proposer Corporate Info
                    </h3>
                    <dl className="mt-2 space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <dt className="text-slate-450 font-medium">Company Name:</dt>
                        <dd className="font-semibold text-slate-800">{viewingProposal.companyInfo.companyName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-450 font-medium">Trade License:</dt>
                        <dd className="font-semibold text-slate-800">{viewingProposal.companyInfo.tradeLicenseNumber}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-450 font-medium">Contact Person:</dt>
                        <dd className="font-semibold text-slate-800">{viewingProposal.companyInfo.contactPerson}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-450 font-medium">Email Address:</dt>
                        <dd className="font-semibold text-slate-800">{viewingProposal.companyInfo.contactEmail}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-450 font-medium">Phone Number:</dt>
                        <dd className="font-semibold text-slate-800">{viewingProposal.companyInfo.contactPhone}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 uppercase text-xs tracking-wider">
                      Business Classification
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                      {viewingProposal.companyInfo.businessDescription}
                    </p>
                  </div>
                </div>

                {/* Covered Locations Breakdown */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 uppercase text-xs tracking-wider">
                    Risk Locations Definition ({viewingProposal.locations.length})
                  </h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-150">
                    {viewingProposal.locations.map((loc, idx) => (
                      <div key={loc.id} className="p-3.5 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-700">Location #{idx + 1}</span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[10px]">
                            {loc.occupancy}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                          <div className="md:col-span-3">
                            <span className="text-slate-400 font-medium">Address:</span>{' '}
                            <span className="text-slate-700 font-semibold">{loc.address}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Indemnity Limit:</span>{' '}
                            <span className="text-brand-green font-bold">{loc.limitOfIndemnity} AED</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Claims (5 Yrs):</span>{' '}
                            <span className="text-slate-700 font-bold capitalize">{loc.claimsHistoryLast5Years}</span>
                          </div>
                          {loc.claimsHistoryLast5Years === 'yes' && (
                            <div className="md:col-span-3 bg-slate-50 p-2.5 rounded border border-slate-200 mt-1">
                              <span className="font-semibold block text-slate-500 mb-0.5">Claims breakdown logs:</span>
                              <p className="text-slate-600 whitespace-pre-line">{loc.claimsDetails}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Offsite Operations */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 uppercase text-xs tracking-wider">
                    Off-site Operations Cover
                  </h3>
                  {viewingProposal.offsiteOperations.coverRequired === 'no' ? (
                    <p className="text-xs text-slate-500 italic">No offsite operations cover requested.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-400 font-medium">Scope Areas:</span>
                        <span className="font-semibold text-slate-800">{viewingProposal.offsiteOperations.location}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-400 font-medium">Off-site Overall Limit:</span>
                        <span className="font-bold text-brand-green">{viewingProposal.offsiteOperations.limitOfIndemnity} AED</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-400 font-medium">Geographical Limit:</span>
                        <span className="font-semibold text-slate-800">{viewingProposal.offsiteOperations.geographicalLimit}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-400 font-medium">Annual Turnover:</span>
                        <span className="font-semibold text-slate-800">{viewingProposal.offsiteOperations.annualTurnover} AED</span>
                      </div>
                      {viewingProposal.offsiteOperations.geographicalLimit !== 'UAE' && (
                        <div className="md:col-span-2">
                          <span className="text-slate-400 font-medium block">Turnover Country Split:</span>
                          <span className="font-semibold text-slate-800 mt-0.5 block">{viewingProposal.offsiteOperations.turnoverSplitDetails}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-400 font-medium">Manual labor allowed:</span>
                        <span className="font-semibold text-slate-800 capitalize">{viewingProposal.offsiteOperations.manualWorkEmployees}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                        <span className="text-slate-400 font-medium">Subcontracted operations:</span>
                        <span className="font-semibold text-slate-800 capitalize">{viewingProposal.offsiteOperations.subcontractedWork}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Liability Extensions */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 uppercase text-xs tracking-wider">
                    Requested Extensions Definition
                  </h3>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${viewingProposal.extensions.propertyBeingWorkedUpon ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className={viewingProposal.extensions.propertyBeingWorkedUpon ? 'text-slate-800 font-semibold' : 'text-slate-400 line-through'}>
                        A. Property being worked upon / contract works and materials
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${viewingProposal.extensions.propertyUnderCareCustodyControl ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className={viewingProposal.extensions.propertyUnderCareCustodyControl ? 'text-slate-800 font-semibold' : 'text-slate-400 line-through'}>
                        B. Property under care, custody and control
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${viewingProposal.extensions.principalsExistingProperty ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className={viewingProposal.extensions.principalsExistingProperty ? 'text-slate-800 font-semibold' : 'text-slate-400 line-through'}>
                        C. Principals existing and surrounding property
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Attachments Section */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5 uppercase text-xs tracking-wider">
                    Uploaded Supporting Documentation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                      <FileSpreadsheet className="w-5 h-5 text-brand-green shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">TRADE LICENSE ATTACHMENT</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[200px] block">
                          {viewingProposal.attachments.tradeLicense?.name || 'Trade_License_Record.pdf'}
                        </span>
                      </div>
                    </div>
                    {viewingProposal.attachments.photos.length > 0 && (
                      <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                        <CheckCircle className="w-5 h-5 text-brand-green shrink-0" />
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">ASSET PHOTOS</span>
                          <span className="font-semibold text-slate-700 block">
                            {viewingProposal.attachments.photos.length} Photo{viewingProposal.attachments.photos.length === 1 ? '' : 's'} Uploaded
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signature Statement block */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center mt-6">
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider mb-1">
                    AUTHORIZED ELECTRONIC DECLARATION RECORD
                  </span>
                  <div className="font-serif italic text-2xl text-brand-blue font-semibold tracking-wide">
                    {viewingProposal.companyInfo.contactPerson}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed max-w-lg mx-auto">
                    Approved online on behalf of {viewingProposal.companyInfo.companyName}. Checked, signed and timestamped as a correct public liability policy application statement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section B: Editing / Filling out the multi-step form */}
          {!viewingProposal && (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
              
              {/* Steps Progress Header Tracker */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4 no-print">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-brand-green bg-brand-green-light px-2 py-0.5 rounded-full border border-brand-green-border">
                    Step {currentStep} of 5
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    •
                  </span>
                  <span className="text-xs font-bold text-slate-650">
                    {STEPS[currentStep - 1].title}
                  </span>
                </div>

                {/* Progress bar container */}
                <div className="w-full sm:w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-green h-full transition-all duration-300 rounded-full"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Dynamic steps selector track for large desktops */}
              <div className="hidden md:flex border-b border-slate-100 bg-slate-50/30 py-3 px-6 justify-between items-center no-print">
                {STEPS.map((step) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.id < currentStep;
                  return (
                    <div
                      key={step.id}
                      onClick={() => {
                        if (step.id < currentStep) {
                          setCurrentStep(step.id);
                        }
                      }}
                      className={`flex items-center gap-2.5 transition-all text-left group select-none
                        ${isCompleted ? 'cursor-pointer hover:text-brand-green' : 'cursor-default'}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all border
                          ${
                            isCompleted
                              ? 'bg-green-100 border-green-200 text-green-700'
                              : isActive
                              ? 'bg-brand-green border-brand-green-hover text-white shadow-sm'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                      >
                        {isCompleted ? '✓' : step.id}
                      </div>
                      <div>
                        <span className={`text-xs font-bold block leading-none
                          ${isActive ? 'text-slate-800' : isCompleted ? 'text-green-700' : 'text-slate-400'}`}>
                          {step.title}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Forms body container */}
              <div className="p-6 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    {currentStep === 1 && (
                      <CompanyInfoStep
                        data={appState.companyInfo}
                        onChange={handleCompanyChange}
                        errors={validationErrors}
                      />
                    )}

                    {currentStep === 2 && (
                      <LocationsStep
                        numberOfLocations={appState.numberOfLocations}
                        locations={appState.locations}
                        onLocationsChange={handleLocationsChange}
                        errors={validationErrors}
                      />
                    )}

                    {currentStep === 3 && (
                      <OffsiteStep
                        offsite={appState.offsiteOperations}
                        extensions={appState.extensions}
                        onOffsiteChange={handleOffsiteChange}
                        onExtensionsChange={handleExtensionsChange}
                        errors={validationErrors}
                      />
                    )}

                    {currentStep === 4 && (
                      <UploadStep
                        tradeLicense={appState.attachments.tradeLicense}
                        photos={appState.attachments.photos}
                        onUploadTradeLicense={handleUploadTradeLicense}
                        onUploadPhotos={handleUploadPhotos}
                        errors={validationErrors}
                      />
                    )}

                    {currentStep === 5 && (
                      <ReviewStep
                        application={appState}
                        signatureName={signatureName}
                        onSignatureChange={setSignatureName}
                        signatureDate={signatureDate}
                        onSignatureDateChange={setSignatureDate}
                        errors={validationErrors}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Actions Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center gap-4 no-print">
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2 text-xs font-semibold text-slate-650 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={saveDraft}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5"
                    title="Save current progress"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Draft
                  </button>
                </div>

                <div>
                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4.5 py-2 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-navy rounded-xl shadow-sm transition-all flex items-center gap-1 cursor-pointer hover:shadow"
                    >
                      Continue <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitProposal}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-white" /> Submit Proposal
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Corporate Footnote */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="text-xs text-slate-400 font-medium">
            © 2026 insuranceMARKET.ae. Licensed by the UAE Central Bank. All rights reserved.
          </p>
          <p className="text-[10px] text-slate-400">
            Form references satisfy standard Dubai JAFZA, Abu Dhabi KIZAD, DDA, and Freezone liability certificates compliance formats.
          </p>
        </div>
      </footer>
    </div>
  );
}
