import React from 'react';
import { Stethoscope, ArrowRight, ShieldAlert, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import SimulatedDataBadge from '../../shared/components/SimulatedDataBadge';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useLanguage } from '../../shared/i18n/LanguageContext';

export default function CropDoctorPage() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Demo Step 1 of 6
            </span>
            <span className="text-xs font-medium text-slate-500">Module Owner: Member 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Stethoscope className="w-7 h-7 text-emerald-600" />
            {lang === 'hi' ? 'फसल डॉक्टर (Crop Doctor)' : 'Crop Doctor'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {lang === 'hi'
              ? 'फसल की बीमारी का लक्षण-आधारित मार्गदर्शन एवं कृषि अधिकारी सलाह।'
              : 'Symptom-guided crop health assistance & expert agricultural advisory.'}
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      {/* Honesty Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold">Simulated Guidance Disclaimer (Demo Rule):</p>
          <p className="text-amber-800 mt-0.5">
            This module provides general educational guidance based on selected symptoms. It does not provide certified diagnosis. Farmers are always advised to contact their nearest <strong>Krishi Vigyan Kendra (KVK)</strong>.
          </p>
        </div>
      </div>

      {/* Placeholder Interface */}
      <Card className="text-center py-12 border-dashed border-2 border-slate-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <Upload className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Crop Health Diagnostic Workspace</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          Member 3 will enrich this module with crop image upload preview, symptom checklist, and preventative measures in Phase 7.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/market-prices">
            <Button icon={ArrowRight}>
              Continue to Step 2: Market Prices
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
