import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Users,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  HelpCircle,
  TrendingUp,
  PackageCheck,
  Percent,
  Warehouse,
  X,
  FileCheck2,
  Info
} from 'lucide-react';
import SimulatedDataBadge from '../../shared/components/SimulatedDataBadge';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Badge from '../../shared/components/Badge';
import FormField from '../../shared/components/FormField';
import { validateRequired, validatePositiveNumber } from '../../shared/utils/validators';
import { useLanguage } from '../../shared/i18n/LanguageContext';

// Import datasets
import fposData from '../../data/fpos.json';
import cropsData from '../../data/crops.json';

export default function FpoSupportPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryCrop = searchParams.get('crop') || 'all';
  const queryQty = searchParams.get('quantity') || '50';

  const [selectedCropFilter, setSelectedCropFilter] = useState(queryCrop);
  const [selectedFpoForJoin, setSelectedFpoForJoin] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Interest Form State
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');
  const [farmerAcres, setFarmerAcres] = useState('5');
  const [formErrors, setFormErrors] = useState({});
  const [joinSuccessRef, setJoinSuccessRef] = useState(null);

  // Filter FPOs by selected crop
  const filteredFpos = useMemo(() => {
    if (selectedCropFilter === 'all') return fposData.fpos;
    return fposData.fpos.filter((fpo) => fpo.focusCrops.includes(selectedCropFilter));
  }, [selectedCropFilter]);

  // Open Join Modal
  const handleOpenJoinModal = (fpo) => {
    setSelectedFpoForJoin(fpo);
    setJoinSuccessRef(null);
    setFormErrors({});
    setIsJoinModalOpen(true);
  };

  // Submit Interest Form
  const handleSubmitInterest = (e) => {
    e.preventDefault();
    const errors = {};

    const nameErr = validateRequired(farmerName, lang === 'hi' ? 'किसान का नाम' : 'Farmer Name');
    if (nameErr) errors.name = nameErr;

    if (!farmerPhone || farmerPhone.trim().length !== 10 || isNaN(Number(farmerPhone))) {
      errors.phone = lang === 'hi' ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें' : 'Enter a valid 10-digit mobile number';
    }

    const villageErr = validateRequired(farmerVillage, lang === 'hi' ? 'गांव/ब्लॉक' : 'Village/Block');
    if (villageErr) errors.village = villageErr;

    const acresErr = validatePositiveNumber(farmerAcres, lang === 'hi' ? 'जमीन (एकड़)' : 'Landholding (Acres)');
    if (acresErr) errors.acres = acresErr;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Generate simulated registration token
    const randomRef = `KM-FPO-${Math.floor(1000 + Math.random() * 9000)}`;
    setJoinSuccessRef(randomRef);

    // Save demo interest locally
    try {
      const existing = JSON.parse(localStorage.getItem('km_fpo_interests') || '[]');
      existing.push({
        ref: randomRef,
        fpoId: selectedFpoForJoin?.id,
        fpoName: selectedFpoForJoin?.name,
        farmerName,
        farmerPhone,
        farmerVillage,
        farmerAcres,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('km_fpo_interests', JSON.stringify(existing));
    } catch {
      // LocalStorage fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Simulated Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Demo Step 5 of 6
            </span>
            <span className="text-xs font-medium text-slate-500">Module Owner: Member 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-emerald-600" />
            {lang === 'hi' ? 'एफपीओ सहयोग और समूह बिक्री' : 'FPO Support & Collective Selling'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {lang === 'hi'
              ? 'किसान उत्पादक संगठन (FPO) से जुड़ें: 500+ किसान मिलकर सामूहिक सौदेबाजी करें और 6% से 12% तक अधिक भाव पाएं।'
              : 'Empowering small farmers with collective buyer negotiation, bulk input discounts, and shared cold storage.'}
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      {/* Educational Banner: What is an FPO? */}
      <Card className="bg-gradient-to-r from-emerald-50 via-white to-sky-50 border-emerald-200 p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {lang === 'hi' ? '🌾 FPO (किसान उत्पादक संगठन) क्या है और यह क्यों जरूरी है?' : '🌾 What is an FPO & Why is Collective Selling Powerful?'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {lang === 'hi'
                ? 'FPO किसानों की अपनी कंपनी होती है। जब एक छोटा किसान अकेले 30 क्विंटल फसल बेचने जाता है, तो उसे बाजार में कम भाव मिलता है। लेकिन जब 600 किसान मिलकर अपनी 18,000 क्विंटल फसल एक साथ बेचते हैं, तो बड़ी कंपनियां ऊंचे प्रीमियम भाव पर सीधे खरीदती हैं।'
                : 'A Farmer Producer Organization (FPO) is a registered producer company owned by farmers. By pooling harvest volumes, smallholder farmers gain the bargaining power of a large corporate enterprise.'}
            </p>
          </div>
        </div>

        {/* 4 Pillars of FPO Advantage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
              <TrendingUp className="w-4 h-4" />
              <span>Higher Collective Price</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Direct institutional contracts with mills & exporters yielding <strong>6%–12% price premiums</strong>.
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-sky-700 font-bold text-xs">
              <Percent className="w-4 h-4" />
              <span>Bulk Input Discounts</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Certified seeds, fertilizers, and biopesticides procured wholesale, saving farmers up to <strong>15% on input costs</strong>.
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
              <Warehouse className="w-4 h-4" />
              <span>Shared Infrastructure</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Access to scientific godowns and cold storage, eliminating <strong>distress sales</strong> during market gluts.
            </p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Annual Profit Dividends</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Zero middleman commissions — profits earned by the FPO are distributed back to member farmers as dividends.
            </p>
          </div>
        </div>
      </Card>

      {/* FPO Directory Controls & Crop Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{lang === 'hi' ? 'क्षेत्रीय FPO निर्देशिका' : 'Regional FPO Directory'}</span>
            <span className="text-xs font-normal text-slate-500">({filteredFpos.length} FPOs found)</span>
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi' ? 'अपनी फसल के आधार पर सक्रिय FPO चुनें और सदस्यता आवेदन करें:' : 'Explore active FPOs handling your crop and register your interest:'}
          </p>
        </div>

        {/* Filter by Crop */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Filter Crop:</span>
          <select
            value={selectedCropFilter}
            onChange={(e) => setSelectedCropFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Crops (सभी फसलें)</option>
            {cropsData.crops.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.hindiName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FPO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredFpos.map((fpo) => (
          <Card key={fpo.id} className="flex flex-col justify-between hover:shadow-md transition-all border-slate-200">
            <div className="space-y-3">
              {/* Header: Name, Reg No, Rating */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {fpo.registrationNo}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{fpo.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Block: {fpo.block}, {fpo.district} ({fpo.state})
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-extrabold bg-emerald-100 text-emerald-900 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    {fpo.memberCount} Farmers
                  </span>
                </div>
              </div>

              {/* Collective Premium Bonus Highlight */}
              <div className="bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-lg text-xs flex items-center justify-between">
                <span className="font-semibold text-emerald-900">Collective Bonus:</span>
                <span className="font-extrabold text-emerald-800">{fpo.collectiveSellingBonus}</span>
              </div>

              {/* Focus Crops */}
              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-slate-500 font-medium">Focus Crops:</span>
                {fpo.focusCrops.map((cropId) => (
                  <span key={cropId} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[11px] capitalize">
                    {cropId}
                  </span>
                ))}
              </div>

              {/* Key Benefits */}
              <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                <span className="font-semibold text-slate-800">Primary Services:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 pl-1">
                  {fpo.keyBenefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              {/* Contact Info (Simulated) */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 flex items-center justify-between">
                <span>{fpo.contactPerson}</span>
                <span className="font-semibold text-slate-700">{fpo.phone}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <Button
                variant="primary"
                className="w-full text-xs py-2 justify-center"
                icon={PackageCheck}
                onClick={() => handleOpenJoinModal(fpo)}
              >
                {lang === 'hi' ? 'FPO से जुड़ने की रुचि दर्ज करें' : 'Express Interest to Join FPO'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Express Interest Modal */}
      {isJoinModalOpen && selectedFpoForJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {lang === 'hi' ? 'FPO सदस्यता रुचि प्रपत्र (Demo)' : 'Express Interest in Joining FPO'}
                </h3>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                  {selectedFpoForJoin.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {joinSuccessRef ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {lang === 'hi' ? 'रुचि सफलतापूर्वक दर्ज की गई!' : 'Interest Registered Successfully!'}
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Application Reference: <strong className="font-mono text-emerald-800">{joinSuccessRef}</strong>.
                </p>
                <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-900 border border-emerald-200 text-left space-y-1">
                  <p><strong>Demo Note:</strong> Your expression of interest has been safely stored locally.</p>
                  <p>In production, this automatically dispatches an SMS alert to <strong>{selectedFpoForJoin.contactPerson}</strong> to arrange village onboarding.</p>
                </div>
                <Button
                  variant="primary"
                  className="text-xs mt-2"
                  onClick={() => setIsJoinModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInterest} className="space-y-3.5 text-xs">
                <FormField
                  label={lang === 'hi' ? 'किसान का पूरा नाम (Full Name)' : 'Farmer Full Name'}
                  error={formErrors.name}
                  required
                >
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Patidar"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField
                    label={lang === 'hi' ? 'मोबाइल नंबर (10 अंक)' : 'Mobile Phone'}
                    error={formErrors.phone}
                    required
                  >
                    <input
                      type="tel"
                      maxLength="10"
                      value={farmerPhone}
                      onChange={(e) => setFarmerPhone(e.target.value)}
                      placeholder="98260XXXXX"
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </FormField>

                  <FormField
                    label={lang === 'hi' ? 'जमीन का रकबा (एकड़)' : 'Landholding (Acres)'}
                    error={formErrors.acres}
                    required
                  >
                    <input
                      type="number"
                      min="1"
                      value={farmerAcres}
                      onChange={(e) => setFarmerAcres(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                    />
                  </FormField>
                </div>

                <FormField
                  label={lang === 'hi' ? 'गांव और ब्लॉक (Village & Block)' : 'Village & Block'}
                  error={formErrors.village}
                  required
                >
                  <input
                    type="text"
                    value={farmerVillage}
                    onChange={(e) => setFarmerVillage(e.target.value)}
                    placeholder="e.g. Dharmkhedi, Sanwer"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </FormField>

                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-500">
                  <Info className="w-3.5 h-3.5 inline text-slate-400 mr-1" />
                  No payment required. FPO membership is voluntary and governed by state cooperative bylaws.
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-xs"
                    onClick={() => setIsJoinModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="text-xs">
                    Submit Registration
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom Demo Stepper Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <Link to={`/net-return?crop=${selectedCropFilter}`}>
          <Button variant="secondary" icon={ArrowLeft}>
            {lang === 'hi' ? 'पिछला: चरण 4 (शुद्ध मुनाफा)' : 'Back: Step 4 (Net Returns)'}
          </Button>
        </Link>

        <Link to="/logistics">
          <Button variant="primary" icon={ArrowRight}>
            {lang === 'hi'
              ? 'अगला: चरण 6 (परिवहन व लॉजिस्टिक्स)'
              : 'Next: Step 6 (Logistics & Transport)'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
