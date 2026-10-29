import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Calculator,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Truck,
  Building2,
  Scale,
  MapPin,
  TrendingUp,
  Percent,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  Users,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import SimulatedDataBadge from '../../shared/components/SimulatedDataBadge';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Badge from '../../shared/components/Badge';
import FormField from '../../shared/components/FormField';
import { formatCurrency, formatQuantity } from '../../shared/utils/formatCurrency';
import { validatePositiveNumber, validateNonNegativeNumber } from '../../shared/utils/validators';
import { calculateNetReturn } from '../../shared/utils/netReturnCalculator';
import { useLanguage } from '../../shared/i18n/LanguageContext';

// Import datasets
import cropsData from '../../data/crops.json';
import buyersData from '../../data/buyers.json';
import logisticsData from '../../data/logistics.json';
import marketPricesData from '../../data/marketPrices.json';

export default function NetReturnPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Query parameters from previous steps
  const queryCrop = searchParams.get('crop') || 'wheat';
  const queryQty = searchParams.get('quantity') || '50';
  const queryPrice = searchParams.get('price') || '2580';
  const queryBuyer = searchParams.get('buyer') || 'Malwa Flour Mills Pvt. Ltd.';
  const queryBuyerId = searchParams.get('buyerId') || 'buyer-1';
  const queryDistance = searchParams.get('distance') || '24';
  const queryPickup = searchParams.get('pickup') === 'true';
  const queryMandiPrice = searchParams.get('mandiPrice') || '2480';
  const queryMandiName = searchParams.get('mandiName') || 'Indore APMC Mandi';

  // State
  const [selectedCropId, setSelectedCropId] = useState(queryCrop);
  const [quantity, setQuantity] = useState(queryQty);
  const [selectedBuyerId, setSelectedBuyerId] = useState(queryBuyerId);
  const [pricePerQuintal, setPricePerQuintal] = useState(queryPrice);
  const [distanceKm, setDistanceKm] = useState(queryDistance);
  const [selectedVehicleId, setSelectedVehicleId] = useState('veh-2'); // default: Bolero pickup
  const [useBuyerPickup, setUseBuyerPickup] = useState(queryPickup);
  const [loadingCostPerQtl, setLoadingCostPerQtl] = useState('15');
  const [unloadingCostPerQtl, setUnloadingCostPerQtl] = useState('15');
  const [mandiFeeRate, setMandiFeeRate] = useState('0'); // 0 for direct buyer, 1.5 for mandi
  const [otherDeductions, setOtherDeductions] = useState('0');

  // Benchmark Mandi State
  const [benchmarkMandiPrice, setBenchmarkMandiPrice] = useState(queryMandiPrice);
  const [benchmarkMandiDistance, setBenchmarkMandiDistance] = useState('18');

  // Validation
  const quantityError = validatePositiveNumber(quantity, lang === 'hi' ? 'मात्रा' : 'Quantity');
  const priceError = validatePositiveNumber(pricePerQuintal, lang === 'hi' ? 'भाव' : 'Price');
  const distanceError = validateNonNegativeNumber(distanceKm, lang === 'hi' ? 'दूरी' : 'Distance');
  const otherCostError = validateNonNegativeNumber(otherDeductions, lang === 'hi' ? 'अन्य खर्च' : 'Other Expenses');

  const parsedQty = !quantityError ? Number(quantity) : 50;
  const parsedPrice = !priceError ? Number(pricePerQuintal) : 2580;
  const parsedDist = !distanceError ? Number(distanceKm) : 24;

  // Selected vehicle rates
  const currentVehicle = useMemo(() => {
    return logisticsData.vehicles.find((v) => v.id === selectedVehicleId) || logisticsData.vehicles[1];
  }, [selectedVehicleId]);

  // Current buyer metadata
  const currentBuyer = useMemo(() => {
    return buyersData.buyers.find((b) => b.id === selectedBuyerId);
  }, [selectedBuyerId]);

  // Handle buyer change
  const handleBuyerSelect = (buyerId) => {
    setSelectedBuyerId(buyerId);
    const buyer = buyersData.buyers.find((b) => b.id === buyerId);
    if (buyer) {
      setPricePerQuintal(String(buyer.offeredPricePerQuintal));
      setDistanceKm(String(buyer.distanceKm));
      setUseBuyerPickup(buyer.pickupAvailable);
      if (buyer.pickupAvailable) {
        // Flat pickup fee per quintal
        setMandiFeeRate('0');
      }
    }
  };

  // 1. Calculate Direct Buyer Net Return
  const buyerTransportCost = useBuyerPickup && currentBuyer?.pickupAvailable
    ? (currentBuyer.pickupChargePerQuintal || 20) * parsedQty
    : parsedDist * currentVehicle.perKmRate;

  const buyerCalculation = useMemo(() => {
    return calculateNetReturn({
      pricePerQuintal: parsedPrice,
      quantityQuintals: parsedQty,
      flatTransportCost: buyerTransportCost,
      loadingPerQuintal: Number(loadingCostPerQtl) || 0,
      unloadingPerQuintal: useBuyerPickup ? 0 : (Number(unloadingCostPerQtl) || 0), // buyer unloads if pickup
      mandiFeePercent: Number(mandiFeeRate) || 0,
      otherDeductions: Number(otherDeductions) || 0,
    });
  }, [parsedPrice, parsedQty, buyerTransportCost, loadingCostPerQtl, unloadingCostPerQtl, useBuyerPickup, mandiFeeRate, otherDeductions]);

  // 2. Calculate Mandi Benchmark Net Return
  const mandiMandiRate = Number(benchmarkMandiPrice) || 2480;
  const mandiDistance = Number(benchmarkMandiDistance) || 18;
  const mandiTransportCost = mandiDistance * currentVehicle.perKmRate;

  const mandiCalculation = useMemo(() => {
    return calculateNetReturn({
      pricePerQuintal: mandiMandiRate,
      quantityQuintals: parsedQty,
      flatTransportCost: mandiTransportCost,
      loadingPerQuintal: 15,
      unloadingPerQuintal: 15,
      mandiFeePercent: 1.5, // Standard 1.5% APMC market cess
      otherDeductions: 100, // Mandi weighment / user fees
    });
  }, [mandiMandiRate, parsedQty, mandiTransportCost]);

  // Net difference
  const netAdvantage = buyerCalculation.estimatedNetReturn - mandiCalculation.estimatedNetReturn;
  const netAdvantagePct = mandiCalculation.estimatedNetReturn > 0
    ? Math.round((netAdvantage / mandiCalculation.estimatedNetReturn) * 1000) / 10
    : 0;

  // Available buyers for chosen crop
  const cropBuyers = useMemo(() => {
    return buyersData.buyers.filter((b) => b.cropId === selectedCropId);
  }, [selectedCropId]);

  return (
    <div className="space-y-6">
      {/* Header & Simulated Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Demo Step 4 of 6
            </span>
            <span className="text-xs font-medium text-slate-500">Module Owner: Member 2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Calculator className="w-7 h-7 text-emerald-600" />
            {lang === 'hi' ? 'शुद्ध मुनाफा कैलकुलेटर (Net Return Calculator)' : 'Net Return Calculator'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {lang === 'hi'
              ? 'परिवहन, लोडिंग, मंडी सेस और अन्य खर्चों को पारदर्शी रूप से घटाकर अपनी वास्तविक जेब की कमाई जानें।'
              : 'Estimate real take-home earnings by subtracting transport, loading/unloading, and mandi taxes.'}
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      {/* Top Banner: Core Result Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Estimated Net Return Card */}
        <Card className="lg:col-span-2 border-l-4 border-l-emerald-600 bg-gradient-to-br from-white via-white to-emerald-50/40 p-5 sm:p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-emerald-600 text-white rounded-full">
                <Sparkles className="w-3 h-3" />
                Estimated Take-Home Net Return
              </span>
              <p className="text-xs text-slate-500 mt-1">
                For {formatQuantity(parsedQty, 'quintal')} sold to <span className="font-semibold text-slate-800">{currentBuyer?.name || 'Buyer'}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-slate-500">Net Take-Home Rate</span>
              <div className="text-lg font-black text-emerald-800">
                {formatCurrency(buyerCalculation.netPricePerQuintal)}
                <span className="text-xs font-normal text-slate-500">/qtl</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {formatCurrency(buyerCalculation.estimatedNetReturn)}
              </div>
              <p className="text-xs font-medium text-emerald-700 mt-0.5">
                Gross Revenue {formatCurrency(buyerCalculation.grossRevenue)} − Total Deductions {formatCurrency(buyerCalculation.totalDeductions)}
              </p>
            </div>

            {/* Visual Formula Callout */}
            <div className="bg-slate-100/90 px-3 py-2 rounded-lg text-xs font-mono text-slate-700 border border-slate-200">
              Net = (₹{parsedPrice} × {parsedQty}) − ₹{buyerCalculation.totalDeductions}
            </div>
          </div>

          {/* Visual Deduction Breakdown Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Earnings Retention: <strong>{Math.round((buyerCalculation.estimatedNetReturn / (buyerCalculation.grossRevenue || 1)) * 100)}%</strong></span>
              <span>Deductions: <strong>{Math.round((buyerCalculation.totalDeductions / (buyerCalculation.grossRevenue || 1)) * 100)}%</strong></span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${Math.min(100, Math.max(0, (buyerCalculation.estimatedNetReturn / (buyerCalculation.grossRevenue || 1)) * 100))}%` }}
                className="bg-emerald-600 transition-all duration-300"
                title="Net Take-Home"
              />
              <div
                style={{ width: `${Math.min(100, Math.max(0, (buyerCalculation.transportCost / (buyerCalculation.grossRevenue || 1)) * 100))}%` }}
                className="bg-sky-500 transition-all duration-300"
                title="Transport"
              />
              <div
                style={{ width: `${Math.min(100, Math.max(0, (buyerCalculation.handlingCost / (buyerCalculation.grossRevenue || 1)) * 100))}%` }}
                className="bg-amber-500 transition-all duration-300"
                title="Handling & Loading"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" /> Net Return</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Transport ({formatCurrency(buyerCalculation.transportCost)})</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Handling ({formatCurrency(buyerCalculation.handlingCost)})</span>
            </div>
          </div>
        </Card>

        {/* Channel Advantage Card: Direct Buyer vs. Mandi APMC */}
        <Card className={`border-l-4 ${netAdvantage >= 0 ? 'border-l-krishi-600 bg-krishi-50/20' : 'border-l-rose-500'} p-5 flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {lang === 'hi' ? 'सीधी बिक्री बनाम मंडी' : 'Direct Buyer vs Mandi'}
              </span>
              <Badge variant={netAdvantage >= 0 ? 'success' : 'danger'}>
                {netAdvantage >= 0 ? `+${netAdvantagePct}% Advantage` : `${netAdvantagePct}% Lower`}
              </Badge>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-white border border-slate-200">
                <span className="font-medium text-slate-700">Direct Buyer Net:</span>
                <span className="font-extrabold text-emerald-700 text-sm">{formatCurrency(buyerCalculation.estimatedNetReturn)}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-white border border-slate-200">
                <span className="font-medium text-slate-700">Mandi APMC Net:</span>
                <span className="font-extrabold text-slate-800 text-sm">{formatCurrency(mandiCalculation.estimatedNetReturn)}</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-emerald-100/60 text-emerald-950 text-xs">
              <strong>Why Direct Buyer wins:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-emerald-900">
                <li>Zero APMC Mandi Cess (Saves 1.5% = ₹{Math.round((mandiMandiRate * parsedQty * 1.5) / 100)})</li>
                <li>{useBuyerPickup ? 'Free/discounted farmgate pickup' : 'Shorter freight route'}</li>
                <li>No double handling at mandi auction floor</li>
              </ul>
            </div>
          </div>

          <div className="mt-3 pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            Estimated extra in your pocket: <strong className="text-emerald-700 text-sm font-bold">+{formatCurrency(Math.max(0, netAdvantage))}</strong>
          </div>
        </Card>
      </div>

      {/* Interactive Deduction Breakdown & Input Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editable Parameter Controls */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-slate-50 border-slate-200 p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              {lang === 'hi' ? 'बिक्री पैरामीटर और लागत विवरण' : 'Sale Parameters & Editable Deductions'}
            </h3>

            {/* Row 1: Crop & Buyer Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label={lang === 'hi' ? 'खरीदार चुनें (Select Buyer)' : 'Select Buyer Offer'}>
                <select
                  value={selectedBuyerId}
                  onChange={(e) => handleBuyerSelect(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {cropBuyers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} • ₹{b.offeredPricePerQuintal}/qtl ({b.distanceKm} km)
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label={lang === 'hi' ? 'ऑफर भाव (₹/क्विंटल)' : 'Offered Price (₹/quintal)'}
                error={priceError}
                required
              >
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min="1"
                    value={pricePerQuintal}
                    onChange={(e) => setPricePerQuintal(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </FormField>
            </div>

            {/* Row 2: Quantity & Distance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label={lang === 'hi' ? 'मात्रा (क्विंटल)' : 'Harvest Quantity (quintals)'}
                error={quantityError}
                required
              >
                <div className="relative">
                  <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </FormField>

              <FormField
                label={lang === 'hi' ? 'दूरी (किलोमीटर)' : 'Transport Distance (km)'}
                error={distanceError}
                required
              >
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    min="0"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </FormField>
            </div>

            {/* Logistics & Farmgate Pickup Option */}
            <div className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-sky-600" />
                  Transport Arrangement
                </span>
                {currentBuyer?.pickupAvailable && (
                  <label className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useBuyerPickup}
                      onChange={(e) => setUseBuyerPickup(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                    Use Buyer Farmgate Pickup (+₹{currentBuyer.pickupChargePerQuintal || 20}/qtl)
                  </label>
                )}
              </div>

              {!useBuyerPickup && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Recommended Vehicle:</label>
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium"
                    >
                      {logisticsData.vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.shortName} • ₹{v.perKmRate}/km ({v.capacityQuintals} qtl cap)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Estimated Freight:</label>
                    <div className="text-xs font-bold text-slate-800 py-1.5 px-2 bg-slate-100 rounded">
                      {parsedDist} km × ₹{currentVehicle.perKmRate}/km = {formatCurrency(parsedDist * currentVehicle.perKmRate)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Handling, Mandi Cess & Other Deductions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label={lang === 'hi' ? 'लोडिंग (₹/क्विंटल)' : 'Loading (₹/qtl)'}>
                <input
                  type="number"
                  min="0"
                  value={loadingCostPerQtl}
                  onChange={(e) => setLoadingCostPerQtl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-medium"
                />
              </FormField>

              <FormField label={lang === 'hi' ? 'अनलोडिंग (₹/क्विंटल)' : 'Unloading (₹/qtl)'}>
                <input
                  type="number"
                  min="0"
                  disabled={useBuyerPickup}
                  value={useBuyerPickup ? '0 (Included)' : unloadingCostPerQtl}
                  onChange={(e) => setUnloadingCostPerQtl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-medium disabled:bg-slate-100 disabled:text-slate-400"
                />
              </FormField>

              <FormField label={lang === 'hi' ? 'अन्य खर्च (पैकिंग/वजन)' : 'Other Fees (Weighment/Packing)'} error={otherCostError}>
                <input
                  type="number"
                  min="0"
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-medium"
                />
              </FormField>
            </div>
          </Card>
        </div>

        {/* Right Col: Mathematical Audit Statement */}
        <div className="space-y-4">
          <Card className="bg-white border-slate-200 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
              <span>Financial Audit Statement</span>
              <span className="text-xs text-slate-400 font-normal">Transparent Formula</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between font-bold text-slate-900 pb-1 border-b">
                <span>1. Gross Crop Value</span>
                <span>{formatCurrency(buyerCalculation.grossRevenue)}</span>
              </div>
              <div className="text-[11px] text-slate-500 pl-2">
                {parsedQty} quintals × ₹{parsedPrice}/quintal
              </div>

              <div className="pt-2 font-bold text-slate-800">
                2. Deductions Breakdown:
              </div>

              <div className="flex justify-between pl-2">
                <span>• Transport Freight:</span>
                <span className="font-semibold text-slate-800">− {formatCurrency(buyerCalculation.transportCost)}</span>
              </div>

              <div className="flex justify-between pl-2">
                <span>• Loading & Handling:</span>
                <span className="font-semibold text-slate-800">− {formatCurrency(buyerCalculation.handlingCost)}</span>
              </div>

              <div className="flex justify-between pl-2">
                <span>• APMC Mandi Cess:</span>
                <span className="font-semibold text-emerald-700">₹0 (Bypassed!)</span>
              </div>

              {Number(otherDeductions) > 0 && (
                <div className="flex justify-between pl-2">
                  <span>• Other Deductions:</span>
                  <span className="font-semibold text-slate-800">− {formatCurrency(buyerCalculation.otherDeductions)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-rose-700 pt-1.5 border-t">
                <span>Total Deductions:</span>
                <span>− {formatCurrency(buyerCalculation.totalDeductions)}</span>
              </div>

              <div className="flex justify-between font-extrabold text-sm text-emerald-800 pt-2 border-t-2 border-slate-200">
                <span>Net Farmer Return:</span>
                <span>{formatCurrency(buyerCalculation.estimatedNetReturn)}</span>
              </div>

              <div className="text-[11px] text-slate-400 italic pt-1">
                Net Take-Home Rate: {formatCurrency(buyerCalculation.netPricePerQuintal)} / quintal
              </div>
            </div>
          </Card>

          {/* Quick link to Logistics */}
          <Card className="bg-sky-50/60 border-sky-200 p-4">
            <div className="flex items-start gap-2.5">
              <Truck className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-sky-950 space-y-1">
                <h4 className="font-bold text-sky-900">Need Dedicated Transport?</h4>
                <p className="text-slate-600">
                  Step 6 provides verified vehicle rate cards and local drivers for hire.
                </p>
                <Link
                  to={`/logistics?quantity=${parsedQty}&distance=${parsedDist}`}
                  className="inline-flex items-center gap-1 font-bold text-sky-700 hover:text-sky-900 pt-1"
                >
                  Explore Logistics Options <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Honest Transparency Notice */}
      <Card className="bg-amber-50/50 border-amber-200 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1">
            <h4 className="font-bold text-amber-900">
              {lang === 'hi' ? '⚖️ पारदर्शी गणना नियम (Estimate Assumptions)' : '⚖️ Estimation Notice & Calculation Assumptions'}
            </h4>
            <p>
              {lang === 'hi'
                ? 'यह गणना एक अनुमान है। वास्तविक परिवहन दरें मार्ग की स्थिति, डीजल भाव और मौसमी मांग के आधार पर भिन्न हो सकती हैं। डायरेक्ट मिल बिक्री में 1.5% मंडी सेस की बचत सीधे किसान के खाते में जुड़ती है।'
                : 'Net return calculations are transparent mathematical estimates based on user-editable costs. Selling directly to verified commercial buyers bypasses the statutory 1.5% APMC market cess, preserving more capital in the farmer\'s pocket.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Bottom Demo Stepper Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <Link to={`/buyer-matching?crop=${selectedCropId}&quantity=${parsedQty}&mandiPrice=${benchmarkMandiPrice}`}>
          <Button variant="secondary" icon={ArrowLeft}>
            {lang === 'hi' ? 'पिछला: चरण 3 (खरीदार खोज)' : 'Back: Step 3 (Buyer Matching)'}
          </Button>
        </Link>

        <Link to={`/fpo-support?crop=${selectedCropId}&quantity=${parsedQty}`}>
          <Button variant="primary" icon={ArrowRight}>
            {lang === 'hi'
              ? 'अगला: चरण 5 (FPO समूह बिक्री सहायता)'
              : 'Next: Step 5 (FPO Support & Collective Selling)'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
