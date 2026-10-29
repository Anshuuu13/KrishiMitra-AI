import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { DEMO_FLOW_MODULES } from './moduleRegistry';
import { useLanguage } from '../shared/i18n/LanguageContext';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const { lang, t } = useLanguage();

  // Check if current route is part of the 6-step demo flow
  const currentDemoStepIndex = DEMO_FLOW_MODULES.findIndex(
    (mod) => mod.path === location.pathname
  );
  const isDemoRoute = currentDemoStepIndex !== -1;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Demo Workflow Stepper Bar (Active on Demo Step routes) */}
      {isDemoRoute && (
        <section className="bg-white border-b border-slate-200 py-3 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-krishi-700">
                {t.demoStepper}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {t.step} {currentDemoStepIndex + 1} of {DEMO_FLOW_MODULES.length}
              </span>
            </div>

            {/* Stepper bubbles */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
              {DEMO_FLOW_MODULES.map((step, idx) => {
                const isCurrent = idx === currentDemoStepIndex;
                const isPassed = idx < currentDemoStepIndex;
                const StepIcon = step.icon;

                return (
                  <React.Fragment key={step.id}>
                    <Link
                      to={step.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        isCurrent
                          ? 'bg-krishi-600 text-white shadow-sm ring-2 ring-krishi-300'
                          : isPassed
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <StepIcon className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {idx + 1}. {lang === 'hi' ? step.hindiName : step.name}
                      </span>
                    </Link>

                    {idx < DEMO_FLOW_MODULES.length - 1 && (
                      <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
