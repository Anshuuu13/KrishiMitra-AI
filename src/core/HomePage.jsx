import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ArrowRight, 
  Stethoscope, 
  TrendingUp, 
  Users, 
  Calculator, 
  Building2, 
  Truck, 
  MessageSquare,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Button from '../shared/components/Button';
import Card from '../shared/components/Card';
import SimulatedDataBadge from '../shared/components/SimulatedDataBadge';
import { useLanguage } from '../shared/i18n/LanguageContext';

export default function HomePage() {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-krishi-800 to-krishi-900 text-white p-6 sm:p-12 lg:p-16 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-200">
            <Sprout className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'hi' ? '10 घंटे का स्टार्टअप हैकाथॉन प्रोटोटाइप' : '10-Hour Startup Hackathon Prototype'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {lang === 'hi' ? (
              <>
                भारतीय किसानों के लिए <span className="text-emerald-300">स्मार्ट निर्णय</span> और <span className="text-earth-500">उचित मुनाफा</span>
              </>
            ) : (
              <>
                Smarter Farming Decisions. <br />
                <span className="text-emerald-300">Fairer Returns</span> for Indian Farmers.
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            {lang === 'hi'
              ? 'कृषिमित्र AI फसल स्वास्थ्य से लेकर पारदर्शी मंडी भाव, खरीदार खोज, शुद्ध मुनाफा गणना, एफपीओ सहयोग और परिवहन को एक सरल ऐप में जोड़ता है।'
              : 'Connecting crop-health guidance, transparent selling decisions, buyer discovery, FPO collective power, and logistics in one simple, farmer-friendly platform.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link to="/dashboard">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold shadow-lg" icon={ArrowRight}>
                {lang === 'hi' ? 'जज डेमो शुरू करें (Dashboard)' : 'Launch Judge Demo (Dashboard)'}
              </Button>
            </Link>

            <Link to="/crop-doctor">
              <Button size="lg" variant="secondary" className="border-white/30 text-white bg-white/10 hover:bg-white/20">
                {lang === 'hi' ? 'चरण 1: फसल डॉक्टर' : 'Step 1: Crop Doctor'}
              </Button>
            </Link>
          </div>

          {/* Value Proposition bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{lang === 'hi' ? 'पारदर्शी मंडी तुलना' : 'Transparent Mandi Comparison'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{lang === 'hi' ? 'वास्तविक शुद्ध मुनाफा' : 'Net Take-Home Estimator'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{lang === 'hi' ? 'सामूहिक एफपीओ शक्ति' : 'FPO Collective Strength'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy: Problem & Ethical Solution */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              Our Hackathon Philosophy
            </span>
            <SimulatedDataBadge />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {lang === 'hi' 
              ? 'हम बिचौलियों को खत्म नहीं करते — हम पारदर्शिता और विकल्प देते हैं'
              : 'We Do Not Eliminate Intermediaries — We Add Transparency & Real Choices'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {lang === 'hi'
              ? 'व्यापारी, ट्रांसपोर्टर और गोदाम संचालक वास्तविक सेवाएं देते हैं। हमारा उद्देश्य अनावश्यक बिचौलिया कटौती कम करना, किसानों को कई खरीदारों व परिवहन के सीधे विकल्प देना और शुद्ध मुनाफे की पारदर्शी गणना उपलब्ध कराना है।'
              : 'Traders, transporters, and storage providers provide vital rural logistics. KrishiMitra AI does not aim to eliminate them; rather, it removes opaque information barriers so farmers can compare offers, know transport costs upfront, and keep a fairer share of their hard-earned harvest.'}
          </p>
        </div>
      </section>

      {/* The 6-Step Judge Demo Flow Overview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {lang === 'hi' ? '६-चरणीय जज डेमो कार्यप्रवाह' : 'The 6-Step Judge Demo Workflow'}
            </h2>
            <p className="text-sm text-slate-500">
              {lang === 'hi'
                ? 'प्रत्येक चरण एक-दूसरे से जुड़ा है ताकि संपूर्ण किसान यात्रा स्पष्ट दिखे।'
                : 'Follow the connected farmer journey from harvest health to net pocket earnings.'}
            </p>
          </div>
          <Link to="/dashboard" className="text-xs font-bold text-krishi-700 hover:text-krishi-800 flex items-center gap-1">
            <span>{lang === 'hi' ? 'डैशबोर्ड में सभी देखें' : 'View all on Dashboard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Step 1 */}
          <Link to="/crop-doctor" className="group">
            <Card hover className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Step 1</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Member 3</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-krishi-700 transition-colors">
                    Crop Doctor
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Symptom checklist and image preview with responsible disclaimer & KVK advisory.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-krishi-600">
                <span>Start Step 1</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Step 2 */}
          <Link to="/market-prices" className="group">
            <Card hover className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Step 2</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Member 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-krishi-700 transition-colors">
                    Smart Market Prices
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Compare regional APMC mandi prices side-by-side with best-price recommendations.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-krishi-600">
                <span>View Prices</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Step 3 */}
          <Link to="/buyer-matching" className="group">
            <Card hover className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Step 3</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Member 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-krishi-700 transition-colors">
                    Buyer Matching
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Match harvest with flour mills, retailers, and traders with clear payment terms.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-krishi-600">
                <span>Find Buyers</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Step 4 */}
          <Link to="/net-return" className="group">
            <Card hover className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Step 4</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Member 2</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-krishi-700 transition-colors">
                    Net Return Calculator
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Formula-backed estimation: Gross revenue minus transport, loading, and fees.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-krishi-600">
                <span>Calculate Net Return</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Step 5 */}
          <Link to="/fpo-support" className="group">
            <Card hover className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Step 5</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Member 3</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-krishi-700 transition-colors">
                    FPO Collective Power
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Discover nearby Farmer Producer Organizations for bulk purchasing & collective selling.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-krishi-600">
                <span>Explore FPOs</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Step 6 */}
          <Link to="/logistics" className="group">
            <Card hover className="h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Step 6</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">Member 3</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Truck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-krishi-700 transition-colors">
                    Logistics & Transport
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Transparent vehicle selection, freight quotes per kilometer, and shared trucking.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-krishi-600">
                <span>Check Freight</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Hindi Assistant Callout */}
      <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-200 text-emerald-800">
            {lang === 'hi' ? 'विशेष सुविधा' : 'Dedicated Feature'}
          </span>
          <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            {lang === 'hi' ? 'हिंदी कृषि सहायक (Hindi Farming Assistant)' : 'Hindi Farming Assistant'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            {lang === 'hi'
              ? 'किसानों के लिए सरल हिंदी में प्रश्नोत्तर एवं खेती के सामान्य दिशा-निर्देश।'
              : 'Rule-based FAQs and quick agricultural answers crafted specifically in clear Hindi for Indian farmers.'}
          </p>
        </div>
        <Link to="/hindi-assistant">
          <Button variant="primary" size="lg" icon={ArrowRight}>
            {lang === 'hi' ? 'हिंदी सहायक खोलें' : 'Open Hindi Assistant'}
          </Button>
        </Link>
      </section>
    </div>
  );
}
