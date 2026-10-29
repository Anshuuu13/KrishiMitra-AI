import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Honesty Component: Displays a prominent badge indicating simulated/sample data.
 * Must be present on every screen/feature using mock data.
 */
export default function SimulatedDataBadge({ message, className = "" }) {
  const { lang } = useLanguage();
  const defaultText = lang === 'hi' 
    ? "नमूना / सिमुलेटेड डेटा (डेमो)" 
    : "Sample / Simulated Data (Demo)";

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-sm ${className}`}>
      <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
      <span>{message || defaultText}</span>
    </div>
  );
}
