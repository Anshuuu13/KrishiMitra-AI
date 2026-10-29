import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, Globe, LayoutDashboard, Home, ChevronRight } from 'lucide-react';
import { useLanguage } from '../shared/i18n/LanguageContext';
import { DEMO_FLOW_MODULES } from './moduleRegistry';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-krishi-600 group-hover:bg-krishi-700 text-white flex items-center justify-center shadow-md shadow-krishi-600/20 transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight block leading-none">
                {lang === 'hi' ? 'कृषिमित्र AI' : 'KrishiMitra'}{' '}
                <span className="text-krishi-600">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">
                {lang === 'hi' ? 'किसान का सच्चा साथी' : 'Smart Farming Partner'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/') ? 'bg-krishi-50 text-krishi-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              {t.navHome}
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard') ? 'bg-krishi-50 text-krishi-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {t.navDashboard}
            </Link>

            {/* Quick Demo Dropdown / Link */}
            <div className="h-5 w-px bg-slate-200 mx-1" />

            {DEMO_FLOW_MODULES.slice(0, 4).map((mod) => (
              <Link
                key={mod.id}
                to={mod.path}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive(mod.path)
                    ? 'bg-krishi-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {lang === 'hi' ? mod.hindiName : mod.navLabel}
              </Link>
            ))}
          </nav>

          {/* Action Buttons: Language Toggle & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors shadow-2xs"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-krishi-600" />
              <span>{t.languageToggle}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-semibold ${
                isActive('/') ? 'bg-krishi-50 text-krishi-700' : 'text-slate-700'
              }`}
            >
              <Home className="w-5 h-5 text-krishi-600" />
              {t.navHome}
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-semibold ${
                isActive('/dashboard') ? 'bg-krishi-50 text-krishi-700' : 'text-slate-700'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 text-krishi-600" />
              {t.navDashboard}
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              {t.demoStepper}
            </p>
            <div className="space-y-1">
              {DEMO_FLOW_MODULES.map((mod, index) => {
                const ModIcon = mod.icon;
                return (
                  <Link
                    key={mod.id}
                    to={mod.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive(mod.path) ? 'bg-krishi-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ModIcon className={`w-4 h-4 ${isActive(mod.path) ? 'text-white' : 'text-krishi-600'}`} />
                      <span>
                        {index + 1}. {lang === 'hi' ? mod.hindiName : mod.name}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
