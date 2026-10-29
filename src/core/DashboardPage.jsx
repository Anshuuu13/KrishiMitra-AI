import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  ArrowRight, 
  Stethoscope, 
  TrendingUp, 
  Users, 
  Calculator, 
  Building2, 
  Truck, 
  MessageSquare,
  ShieldCheck,
  Wheat,
  Store,
  BadgePercent
} from 'lucide-react';
import Card from '../shared/components/Card';
import Button from '../shared/components/Button';
import Badge from '../shared/components/Badge';
import SimulatedDataBadge from '../shared/components/SimulatedDataBadge';
import { useLanguage } from '../shared/i18n/LanguageContext';
import { DEMO_FLOW_MODULES } from './moduleRegistry';

export default function DashboardPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary">
              {lang === 'hi' ? 'स्टार्टअप हैकाथॉन डैशबोर्ड' : 'Startup Hackathon Dashboard'}
            </Badge>
            <SimulatedDataBadge />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'hi' ? 'कृषिमित्र AI कमांड सेंटर' : 'KrishiMitra Command Center'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {lang === 'hi'
              ? '६-चरणीय जज डेमो कार्यप्रवाह और टीम मॉड्यूल एक नज़र में।'
              : 'Interactive 6-step judge demo flow connecting health, pricing, buyers, and logistics.'}
          </p>
        </div>

        {/* Big Start Judge Demo Button */}
        <Link to="/crop-doctor">
          <Button size="lg" className="w-full md:w-auto shadow-md" icon={Play}>
            {lang === 'hi' ? 'जज डेमो शुरू करें (चरण १)' : 'Start Judge Demo Flow (Step 1)'}
          </Button>
        </Link>
      </div>

      {/* Simulated Quick Metrics (Labeled as Sample Data) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-krishi-600">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Tracked Crops</span>
            <Wheat className="w-5 h-5 text-krishi-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">6 Major Crops</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Wheat, Rice, Soybean, Onion...</p>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Monitored Mandis</span>
            <Store className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">18 Mandis</p>
          <p className="text-[11px] text-slate-400 mt-0.5">MP, Maharashtra & UP hubs</p>
        </Card>

        <Card className="border-l-4 border-l-sky-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Sample Buyers</span>
            <Users className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">12 Offers</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Flour mills, food processors</p>
        </Card>

        <Card className="border-l-4 border-l-earth-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Net Return Gain</span>
            <BadgePercent className="w-5 h-5 text-earth-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">+14.2%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Simulated average take-home gain</p>
        </Card>
      </div>

      {/* Primary Judge Demo Workflow (Ordered Steps 1 through 6) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {lang === 'hi' ? 'जज डेमो प्रवाह (Judge Demo Flow)' : 'Judge Demo Flow Steps'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'hi'
                ? 'जज को इस क्रम में ऐप दिखाएं: फसल डॉक्टर -> मंडी भाव -> खरीदार -> शुद्ध मुनाफा -> एफपीओ -> लॉजिस्टिक्स'
                : 'Follow this sequential path for a complete judge evaluation from harvest to profit.'}
            </p>
          </div>
          <span className="text-xs font-semibold text-krishi-700 bg-krishi-50 px-3 py-1 rounded-full border border-krishi-200">
            6 Connected Steps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEMO_FLOW_MODULES.map((module, index) => {
            const ModIcon = module.icon;
            return (
              <Card key={module.id} hover className="flex flex-col justify-between border-slate-200 group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-krishi-100 text-krishi-800 text-xs font-extrabold">
                      {index + 1}
                    </span>
                    <Badge variant={module.owner === 'Member 2' ? 'info' : 'primary'}>
                      {module.owner}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-krishi-50 text-krishi-700 flex items-center justify-center transition-colors">
                      <ModIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-krishi-700 transition-colors">
                        {lang === 'hi' ? module.hindiName : module.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">Step {index + 1} in Demo Flow</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link to={module.path} className="w-full">
                    <Button variant="secondary" size="sm" className="w-full justify-between" icon={ArrowRight}>
                      <span>{lang === 'hi' ? 'खोलें' : 'Open Step'}</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Bonus / Assistant Module Card */}
      <Card className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'hi' ? 'हिंदी कृषि सहायक' : 'Hindi Farming Assistant'}
                </h3>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                  Member 3
                </span>
                <SimulatedDataBadge message="FAQ Demo" />
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {lang === 'hi'
                  ? 'सरल हिंदी में खेती की सलाह, बुवाई समय और खाद के नियम-आधारित प्रश्नोत्तर।'
                  : 'Accessible farming FAQs in vernacular Hindi for sowing, irrigation, and mandi guidelines.'}
              </p>
            </div>
          </div>
          <Link to="/hindi-assistant">
            <Button variant="primary" size="sm" icon={ArrowRight}>
              {lang === 'hi' ? 'सहायक देखें' : 'Open Assistant'}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
