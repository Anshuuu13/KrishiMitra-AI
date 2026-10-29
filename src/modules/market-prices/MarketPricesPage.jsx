import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  SlidersHorizontal,
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  Scale
} from 'lucide-react';
import SimulatedDataBadge from '../../shared/components/SimulatedDataBadge';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Badge from '../../shared/components/Badge';
import FormField from '../../shared/components/FormField';
import { formatCurrency, formatQuantity } from '../../shared/utils/formatCurrency';
import { validatePositiveNumber } from '../../shared/utils/validators';
import { useLanguage } from '../../shared/i18n/LanguageContext';

// Import simulated datasets
import cropsData from '../../data/crops.json';
import marketPricesData from '../../data/marketPrices.json';

export default function MarketPricesPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial values from URL query parameters (or sensible defaults)
  const queryCrop = searchParams.get('crop') || 'wheat';
  const queryLocation = searchParams.get('location') || 'indore';
  const queryQuantity = searchParams.get('quantity') || '50';

  const [selectedCropId, setSelectedCropId] = useState(queryCrop);
  const [selectedLocationId, setSelectedLocationId] = useState(queryLocation);
  const [quantityInput, setQuantityInput] = useState(queryQuantity);
  const [sortBy, setSortBy] = useState('price-desc'); // 'price-desc', 'distance-asc', 'arrival-desc'
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Validation
  const quantityError = validatePositiveNumber(quantityInput, lang === 'hi' ? 'मात्रा' : 'Quantity');

  // Synchronize state changes to URL query parameters
  const updateParams = (newCrop, newLocation, newQty) => {
    const params = new URLSearchParams();
    if (newCrop) params.set('crop', newCrop);
    if (newLocation) params.set('location', newLocation);
    if (newQty && !isNaN(Number(newQty)) && Number(newQty) > 0) params.set('quantity', newQty);
    setSearchParams(params, { replace: true });
  };

  const handleCropChange = (cropId) => {
    setSelectedCropId(cropId);
    updateParams(cropId, selectedLocationId, quantityInput);
  };

  const handleLocationChange = (locId) => {
    setSelectedLocationId(locId);
    updateParams(selectedCropId, locId, quantityInput);
  };

  const handleQuantityChange = (val) => {
    setQuantityInput(val);
    updateParams(selectedCropId, selectedLocationId, val);
  };

  // Find selected crop metadata
  const currentCrop = useMemo(() => {
    return cropsData.crops.find((c) => c.id === selectedCropId) || cropsData.crops[0];
  }, [selectedCropId]);

  // Filter prices for the selected crop
  const filteredPrices = useMemo(() => {
    const list = marketPricesData.prices.filter((p) => p.cropId === selectedCropId);

    return [...list].sort((a, b) => {
      if (sortBy === 'price-desc') return b.modalPrice - a.modalPrice;
      if (sortBy === 'distance-asc') return a.distanceKm - b.distanceKm;
      if (sortBy === 'arrival-desc') return b.arrivalVolumeQuintals - a.arrivalVolumeQuintals;
      return 0;
    });
  }, [selectedCropId, sortBy]);

  // Identify highest price mandi
  const bestMandi = useMemo(() => {
    if (!filteredPrices.length) return null;
    return [...filteredPrices].sort((a, b) => b.modalPrice - a.modalPrice)[0];
  }, [filteredPrices]);

  const lowestPrice = useMemo(() => {
    if (!filteredPrices.length) return 0;
    return Math.min(...filteredPrices.map((p) => p.modalPrice));
  }, [filteredPrices]);

  const parsedQty = !quantityError ? Number(quantityInput) : 50;

  // Navigate forward into Step 3 (Buyer Matching) carrying context
  const handleProceedToBuyers = (priceItem) => {
    const targetPrice = priceItem ? priceItem.modalPrice : (bestMandi ? bestMandi.modalPrice : 0);
    const targetMandi = priceItem ? priceItem.mandiName : (bestMandi ? bestMandi.mandiName : '');
    navigate(
      `/buyer-matching?crop=${selectedCropId}&location=${selectedLocationId}&quantity=${parsedQty}&mandiPrice=${targetPrice}&mandiName=${encodeURIComponent(targetMandi)}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Simulated Badge */}
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
              ? 'आस-पास की मंडियों के भाव की तुलना करें और सर्वश्रेष्ठ भाव का चुनाव करें।'
              : 'Compare prices across regional APMC mandis to maximize your harvest value.'}
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      {/* Filter & Selector Control Bar */}
      <Card className="bg-slate-50 border-slate-200 p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Crop Selector */}
          <FormField
            label={lang === 'hi' ? '1. फसल चुनें (Select Crop)' : '1. Select Crop'}
            required
          >
            <select
              value={selectedCropId}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {cropsData.crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name} ({crop.hindiName}) {crop.msp ? `• MSP ₹${crop.msp}` : ''}
                </option>
              ))}
            </select>
          </FormField>

          {/* Location Selector */}
          <FormField
            label={lang === 'hi' ? '2. आपका क्षेत्र (Location)' : '2. Your Location / District'}
            required
          >
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={selectedLocationId}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {marketPricesData.locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}, {loc.state}
                  </option>
                ))}
              </select>
            </div>
          </FormField>

          {/* Quantity Input */}
          <FormField
            label={lang === 'hi' ? '3. अनुमानित मात्रा (क्विंटल)' : '3. Expected Harvest Quantity'}
            error={quantityError}
            helperText={lang === 'hi' ? '1 क्विंटल = 100 किलोग्राम' : '1 quintal = 100 kg'}
            required
          >
            <div className="relative">
              <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                min="1"
                step="1"
                value={quantityInput}
                onChange={(e) => handleQuantityChange(e.target.value)}
                placeholder="e.g. 50"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-14 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">
                quintal
              </span>
            </div>
          </FormField>
        </div>
      </Card>

      {/* Top Metric Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Best Price Mandi */}
        <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              {lang === 'hi' ? 'सर्वश्रेष्ठ मंडी भाव' : 'Best Available Mandi'}
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {bestMandi ? formatCurrency(bestMandi.modalPrice) : '—'}
              <span className="text-xs font-normal text-slate-500 ml-1">/ quintal</span>
            </div>
            <p className="text-xs font-semibold text-emerald-700 mt-1 truncate">
              {bestMandi ? bestMandi.mandiName : 'No Mandi found'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {bestMandi ? `${bestMandi.distanceKm} km away` : ''}
            </p>
          </div>
        </Card>

        {/* Government MSP Benchmark */}
        <Card className="border-l-4 border-l-amber-500">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              {lang === 'hi' ? 'सरकारी MSP (न्यूनतम मूल्य)' : 'Official Govt. MSP'}
            </span>
            <Badge variant="warning">{lang === 'hi' ? 'सुरक्षा घेरा' : 'Safety Net'}</Badge>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentCrop.msp ? formatCurrency(currentCrop.msp) : 'No MSP'}
              {currentCrop.msp && <span className="text-xs font-normal text-slate-500 ml-1">/ quintal</span>}
            </div>
            {currentCrop.msp && bestMandi ? (
              <p className={`text-xs font-semibold mt-1 ${bestMandi.modalPrice >= currentCrop.msp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {bestMandi.modalPrice >= currentCrop.msp
                  ? `+${formatCurrency(bestMandi.modalPrice - currentCrop.msp)} (${Math.round(((bestMandi.modalPrice - currentCrop.msp) / currentCrop.msp) * 100)}%) above MSP`
                  : `-${formatCurrency(currentCrop.msp - bestMandi.modalPrice)} below MSP`}
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-1">Perishable crop (Market driven)</p>
            )}
            <p className="text-xs text-slate-400 mt-0.5">Central Govt. Rabi/Kharif benchmark</p>
          </div>
        </Card>

        {/* Price Spread / Range */}
        <Card className="border-l-4 border-l-sky-500">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              {lang === 'hi' ? 'मंडी भाव का अंतर' : 'Regional Price Spread'}
            </span>
            <SlidersHorizontal className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {bestMandi && lowestPrice ? formatCurrency(bestMandi.modalPrice - lowestPrice) : '₹0'}
              <span className="text-xs font-normal text-slate-500 ml-1">/ quintal</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Low: {formatCurrency(lowestPrice)} • High: {bestMandi ? formatCurrency(bestMandi.modalPrice) : '—'}
            </p>
            <p className="text-xs text-sky-700 font-medium mt-0.5">
              Selling in the right mandi saves ₹{(bestMandi ? bestMandi.modalPrice - lowestPrice : 0) * parsedQty} on {parsedQty} qtls!
            </p>
          </div>
        </Card>

        {/* Estimated Gross Mandi Value */}
        <Card className="border-l-4 border-l-krishi-600 bg-gradient-to-br from-white to-krishi-50/30">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-krishi-800">
              {lang === 'hi' ? 'अनुमानित कुल उपज मूल्य' : 'Est. Mandi Gross Value'}
            </span>
            <Layers className="w-4 h-4 text-krishi-700" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
              {bestMandi ? formatCurrency(bestMandi.modalPrice * parsedQty) : '—'}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              For {formatQuantity(parsedQty, 'quintal')} @ {bestMandi ? formatCurrency(bestMandi.modalPrice) : '—'}
            </p>
            <p className="text-xs text-amber-600 font-medium mt-0.5">
              *Before transport & 1.5% APMC fees
            </p>
          </div>
        </Card>
      </div>

      {/* Comparison View Controls & Table/Card List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{lang === 'hi' ? 'आस-पास की मंडियों की तुलना' : 'Nearby APMC Mandi Comparison'}</span>
              <span className="text-xs font-normal text-slate-500">({filteredPrices.length} mandis found)</span>
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'hi'
                ? 'मॉडल भाव वह भाव है जिस पर सबसे अधिक बिक्री होती है।'
                : 'Modal price indicates the most common prevailing rate on today\'s trading floor.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg text-xs font-medium px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="price-desc">{lang === 'hi' ? 'उच्चतम भाव पहले' : 'Highest Price First'}</option>
              <option value="distance-asc">{lang === 'hi' ? 'निकटतम मंडी पहले' : 'Closest Distance First'}</option>
              <option value="arrival-desc">{lang === 'hi' ? 'अधिक आवक पहले' : 'Highest Arrival Volume'}</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        {/* View Mode: Cards */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((mandi) => {
              const isBest = bestMandi && mandi.id === bestMandi.id;
              return (
                <Card
                  key={mandi.id}
                  className={`flex flex-col justify-between transition-all hover:shadow-md ${
                    isBest ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isBest && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-emerald-600 text-white rounded-full mb-1">
                            <Sparkles className="w-3 h-3" />
                            Best Price
                          </span>
                        )}
                        <h3 className="text-base font-bold text-slate-900">{mandi.mandiName}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {mandi.district}, {mandi.state} • <span className="font-semibold text-slate-700">{mandi.distanceKm} km</span>
                        </p>
                      </div>

                      {/* Trend Badge */}
                      <div className="text-right">
                        {mandi.trend === 'up' && (
                          <span className="inline-flex items-center text-xs font-semibold text-emerald-600">
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{mandi.trendPercentage}%
                          </span>
                        )}
                        {mandi.trend === 'down' && (
                          <span className="inline-flex items-center text-xs font-semibold text-rose-600">
                            <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {mandi.trendPercentage}%
                          </span>
                        )}
                        {mandi.trend === 'stable' && (
                          <span className="inline-flex items-center text-xs font-medium text-slate-500">
                            <Minus className="w-3.5 h-3.5 mr-0.5" /> Stable
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price Figures */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Modal Rate:</span>
                        <span className="text-2xl font-black text-slate-900">
                          {formatCurrency(mandi.modalPrice)}
                          <span className="text-xs font-normal text-slate-500">/qtl</span>
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
                        <span>Min: {formatCurrency(mandi.minPrice)}</span>
                        <span>Max: {formatCurrency(mandi.maxPrice)}</span>
                      </div>
                    </div>

                    {/* Details: Arrival, Fee, Grade */}
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Grade:</span>
                        <span className="font-medium text-slate-800">{mandi.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Arrivals Today:</span>
                        <span className="font-medium text-slate-800">{mandi.arrivalVolumeQuintals.toLocaleString()} quintals</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">APMC Mandi Fee:</span>
                        <span className="font-medium text-amber-700">{mandi.mandiFeePercent}% cess</span>
                      </div>
                    </div>
                  </div>

                  {/* Forward Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <Button
                      variant={isBest ? 'primary' : 'outline'}
                      className="w-full text-xs py-2 justify-center"
                      icon={ArrowRight}
                      onClick={() => handleProceedToBuyers(mandi)}
                    >
                      {lang === 'hi' ? 'व्यापारी ऑफर देखें (Compare Buyers)' : 'Find Buyers for this Rate'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* View Mode: Table */
          <Card className="overflow-x-auto p-0 border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-xs uppercase font-semibold text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Mandi / Market</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Modal Price (₹/qtl)</th>
                  <th className="py-3 px-4">Range (Min - Max)</th>
                  <th className="py-3 px-4">Trend</th>
                  <th className="py-3 px-4">Mandi Fee</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrices.map((mandi) => {
                  const isBest = bestMandi && mandi.id === bestMandi.id;
                  return (
                    <tr key={mandi.id} className={isBest ? 'bg-emerald-50/30' : 'hover:bg-slate-50'}>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {mandi.mandiName}
                          {isBest && (
                            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-600 text-white rounded">
                              Best
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{mandi.district}, {mandi.state} • {mandi.grade}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">{mandi.distanceKm} km</td>
                      <td className="py-3 px-4">
                        <span className="text-base font-extrabold text-slate-900">
                          {formatCurrency(mandi.modalPrice)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {formatCurrency(mandi.minPrice)} – {formatCurrency(mandi.maxPrice)}
                      </td>
                      <td className="py-3 px-4">
                        {mandi.trend === 'up' && (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center">
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +{mandi.trendPercentage}%
                          </span>
                        )}
                        {mandi.trend === 'down' && (
                          <span className="text-xs font-semibold text-rose-600 flex items-center">
                            <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> {mandi.trendPercentage}%
                          </span>
                        )}
                        {mandi.trend === 'stable' && (
                          <span className="text-xs font-medium text-slate-500">Stable</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs font-medium text-amber-700">{mandi.mandiFeePercent}%</td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant={isBest ? 'primary' : 'outline'}
                          className="text-xs py-1.5 px-3"
                          icon={ArrowRight}
                          onClick={() => handleProceedToBuyers(mandi)}
                        >
                          Compare
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Educational Callout: What is Modal Price & Intermediary Role */}
      <Card className="bg-amber-50/50 border-amber-200 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1">
            <h4 className="font-bold text-amber-900">
              {lang === 'hi' ? '💡 मंडी भाव और शुद्ध मुनाफे में अंतर' : '💡 Mandi Modal Price vs. True Take-Home Return'}
            </h4>
            <p>
              {lang === 'hi'
                ? 'मंडी में फसल ले जाने पर 1.5% मंडी सेस, दूरी का परिवहन भाड़ा और ₹30/क्विंटल तुलाई व पल्लेदारी कटती है। कई बार स्थानीय सत्यापित खरीदार को थोड़ा कम भाव पर सीधे बेचना या FPO के माध्यम से सामूहिक रूप से बेचना मंडी से ज्यादा शुद्ध मुनाफा दे जाता है।'
                : 'Mandi trading involves transportation freight, loading charges, and a 1.5% APMC market cess. Selling directly to verified commercial buyers or pooling via an FPO can often yield higher net take-home earnings even if the nominal mandi quote looks slightly higher.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Bottom Demo Workflow Stepper Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <Link to="/crop-doctor">
          <Button variant="secondary" icon={ArrowLeft}>
            {lang === 'hi' ? 'पिछला: चरण 1 (क्रॉप डॉक्टर)' : 'Back: Step 1 (Crop Doctor)'}
          </Button>
        </Link>

        <Button
          variant="primary"
          icon={ArrowRight}
          onClick={() => handleProceedToBuyers(bestMandi)}
        >
          {lang === 'hi'
            ? 'अगला: चरण 3 (खरीदार मिलान और तुलना)'
            : 'Next: Step 3 (Compare Buyer Offers)'}
        </Button>
      </div>
    </div>
  );
}
