import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../shared/i18n/LanguageContext';

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-krishi-600 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                KrishiMitra AI
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lang === 'hi'
                ? 'भारतीय किसानों को फसल स्वास्थ्य, पारदर्शी मंडी भाव, खरीदार खोज और लॉजिस्टिक्स में सशक्त बनाने वाला एकीकृत प्लेटफॉर्म।'
                : 'A transparent agricultural decision platform bridging crop health, fair market prices, buyer connections, and logistics for Indian farmers.'}
            </p>
          </div>

          {/* Farmer Advisory & Helpline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'hi' ? 'किसान सहायता एवं संपर्क' : 'Farmer Support & Emergency'}
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Kisan Call Center: 1800-180-1551</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Toll-free government helpline for real-time agricultural advisories.
              </p>
            </div>
          </div>

          {/* Hackathon Honesty & Transparency Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              {t.disclaimerTitle}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.disclaimerText}
            </p>
            <p className="text-[11px] text-slate-500">
              Built for Startup Hackathon 2026 by 3-Member Team.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 KrishiMitra AI. Open-source educational project.</p>
          <p className="flex items-center gap-1">
            Built with care for Indian farmers
          </p>
        </div>
      </div>
    </footer>
  );
}
