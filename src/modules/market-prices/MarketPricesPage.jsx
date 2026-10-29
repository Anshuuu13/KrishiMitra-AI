import React from 'react';
import { TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SimulatedDataBadge from '../../shared/components/SimulatedDataBadge';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useLanguage } from '../../shared/i18n/LanguageContext';

export default function MarketPricesPage() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Demo Step 2 of 6
            </span>
            <span className="text-xs font-medium text-slate-500">Module Owner: Member 2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-emerald-600" />
            {lang === 'hi' ? 'स्मार्ट मंडी भाव (Market Prices)' : 'Smart Market Prices'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {lang === 'hi'
              ? 'आस-पास की मंडियों के भाव की तुलना करें और सर्वश्रेष्ठ मूल्य पाएं।'
              : 'Compare crop prices across regional APMC mandis to discover the best price.'}
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      <Card className="text-center py-12 border-dashed border-2 border-slate-300">
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Regional Mandi Price Comparison</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2">
          Member 2 will build the interactive crop and mandi selector, price comparison table, and best-price highlighter in Phase 4.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link to="/crop-doctor">
            <Button variant="secondary" icon={ArrowLeft}>
              Back: Step 1
            </Button>
          </Link>
          <Link to="/buyer-matching">
            <Button icon={ArrowRight}>
              Continue to Step 3: Buyer Matching
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
