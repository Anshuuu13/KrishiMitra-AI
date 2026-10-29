import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Users,
  MapPin,
  Star,
  CheckCircle2,
  Truck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Filter,
  DollarSign,
  Clock,
  Phone,
  Scale,
  ShieldCheck,
  Building2,
  Info,
  Check,
  X
} from 'lucide-react';
import SimulatedDataBadge from '../../shared/components/SimulatedDataBadge';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Badge from '../../shared/components/Badge';
import FormField from '../../shared/components/FormField';
import { formatCurrency, formatQuantity } from '../../shared/utils/formatCurrency';
import { validatePositiveNumber } from '../../shared/utils/validators';
import { useLanguage } from '../../shared/i18n/LanguageContext';

// Import datasets
import buyersData from '../../data/buyers.json';
import cropsData from '../../data/crops.json';
import marketPricesData from '../../data/marketPrices.json';

export default function BuyerMatchingPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query parameters from earlier steps
  const queryCrop = searchParams.get('crop') || 'wheat';
  const queryLocation = searchParams.get('location') || 'indore';
  const queryQuantity = searchParams.get('quantity') || '50';
  const queryMandiPrice = searchParams.get('mandiPrice') || '2480';
  const queryMandiName = searchParams.get('mandiName') || 'Indore APMC Mandi';

  // Filters & Search State
  const [selectedCropId, setSelectedCropId] = useState(queryCrop);
  const [selectedLocationId, setSelectedLocationId] = useState(queryLocation);
  const [quantityInput, setQuantityInput] = useState(queryQuantity);
  const [paymentFilter, setPaymentFilter] = useState('all'); // 'all' | 'immediate' | 'next_day'
  const [pickupOnly, setPickupOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('price-desc'); // 'price-desc' | 'distance-asc' | 'rating-desc'

  // Side-by-side comparison selection state (stores buyer IDs)
  const [comparedBuyerIds, setComparedBuyerIds] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  // Validation
  const quantityError = validatePositiveNumber(quantityInput, lang === 'hi' ? 'मात्रा' : 'Quantity');
  const parsedQty = !quantityError ? Number(quantityInput) : 50;
  const mandiPriceNum = Number(queryMandiPrice) || 2480;

  // Sync state changes with URL query parameters
  const updateParams = (crop, loc, qty) => {
    const params = new URLSearchParams(searchParams);
    if (crop) params.set('crop', crop);
    if (loc) params.set('location', loc);
    if (qty && !isNaN(Number(qty)) && Number(qty) > 0) params.set('quantity', qty);
    setSearchParams(params, { replace: true });
  };

  const handleCropChange = (cropId) => {
    setSelectedCropId(cropId);
    setComparedBuyerIds([]);
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

  // Current crop metadata
  const currentCrop = useMemo(() => {
    return cropsData.crops.find((c) => c.id === selectedCropId) || cropsData.crops[0];
  }, [selectedCropId]);

  // Filtered & Sorted Buyers
  const filteredBuyers = useMemo(() => {
    return buyersData.buyers
      .filter((buyer) => {
        // Match crop
        if (buyer.cropId !== selectedCropId) return false;
        // Match payment filter
        if (paymentFilter === 'immediate' && buyer.paymentTermsType !== 'immediate') return false;
        if (paymentFilter === 'next_day' && buyer.paymentTermsType !== 'next_day') return false;
        // Match pickup toggle
        if (pickupOnly && !buyer.pickupAvailable) return false;
        // Match verified toggle
        if (verifiedOnly && !buyer.verified) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.offeredPricePerQuintal - a.offeredPricePerQuintal;
        if (sortBy === 'distance-asc') return a.distanceKm - b.distanceKm;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        return 0;
      });
  }, [selectedCropId, paymentFilter, pickupOnly, verifiedOnly, sortBy]);

  // Best buyer offer
  const bestBuyer = useMemo(() => {
    if (!filteredBuyers.length) return null;
    return [...filteredBuyers].sort((a, b) => b.offeredPricePerQuintal - a.offeredPricePerQuintal)[0];
  }, [filteredBuyers]);

  // Toggle buyer into comparison set (max 2)
  const toggleComparison = (buyerId) => {
    setComparedBuyerIds((prev) => {
      if (prev.includes(buyerId)) {
        return prev.filter((id) => id !== buyerId);
      }
      if (prev.length >= 2) {
        return [prev[1], buyerId]; // Keep the last one and add new
      }
      return [...prev, buyerId];
    });
  };

  // Forward into Step 4 (Net Returns Calculator)
  const handleProceedToCalculator = (buyer) => {
    const targetBuyer = buyer || bestBuyer;
    const buyerPrice = targetBuyer ? targetBuyer.offeredPricePerQuintal : mandiPriceNum;
    const buyerName = targetBuyer ? targetBuyer.name : 'Sample Buyer';
    const buyerDist = targetBuyer ? targetBuyer.distanceKm : 25;
    const isPickup = targetBuyer ? targetBuyer.pickupAvailable : false;

    navigate(
      `/net-return?crop=${selectedCropId}&quantity=${parsedQty}&location=${selectedLocationId}&price=${buyerPrice}&buyer=${encodeURIComponent(buyerName)}&buyerId=${targetBuyer?.id || ''}&distance=${buyerDist}&pickup=${isPickup}&mandiPrice=${mandiPriceNum}&mandiName=${encodeURIComponent(queryMandiName)}`
    );
  };

  const comparedBuyerObjects = useMemo(() => {
    return buyersData.buyers.filter((b) => comparedBuyerIds.includes(b.id));
  }, [comparedBuyerIds]);

  return (
    <div className="space-y-6">
      {/* Header & Simulated Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Demo Step 3 of 6
            </span>
            <span className="text-xs font-medium text-slate-500">Module Owner: Member 2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" />
            {lang === 'hi' ? 'खरीदार खोज और तुलना (Buyer Matching)' : 'Buyer Matching & Offers'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {lang === 'hi'
              ? 'बिचौलियों की अनावश्यक परतों को हटाएं: सत्यापित खरीदारों से सीधे जुड़ें और पारदर्शी ऑफर की तुलना करें।'
              : 'Connect directly with flour mills, processors, and retailers with upfront payment terms.'}
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      {/* Step 2 Benchmark Notice Card */}
      <Card className="bg-gradient-to-r from-emerald-50/80 via-white to-slate-50 border-emerald-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                {lang === 'hi' ? 'चरण 2 से प्राप्त मंडी संदर्भ भाव' : 'Benchmark Mandi Rate from Step 2'}
              </div>
              <div className="text-base font-extrabold text-slate-900">
                {queryMandiName}: {formatCurrency(mandiPriceNum)} / quintal
              </div>
              <p className="text-xs text-slate-600">
                {lang === 'hi'
                  ? 'मंडी में 1.5% मंडी सेस लगता है। नीचे दिए गए सीधे खरीदारों के भाव देखें जो बिना सेस के मिल सकते हैं।'
                  : 'Mandis levy a 1.5% APMC fee. Compare with direct buyer bids that eliminate mandi tax deductions.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link to={`/market-prices?crop=${selectedCropId}&location=${selectedLocationId}&quantity=${parsedQty}`}>
              <Button variant="outline" className="text-xs py-1.5">
                {lang === 'hi' ? 'मंडी भाव बदलें' : 'Adjust Mandi Rate'}
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Control Bar: Crop, Location, Quantity & Filters */}
      <Card className="bg-slate-50 border-slate-200 p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Crop Selector */}
          <FormField label={lang === 'hi' ? 'फसल (Crop)' : 'Crop'} required>
            <select
              value={selectedCropId}
              onChange={(e) => handleCropChange(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {cropsData.crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.hindiName})
                </option>
              ))}
            </select>
          </FormField>

          {/* Location Selector */}
          <FormField label={lang === 'hi' ? 'आपका स्थान (Location)' : 'Your Location'} required>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={selectedLocationId}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {marketPricesData.locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}, {loc.state}
                  </option>
                ))}
              </select>
            </div>
          </FormField>

          {/* Quantity */}
          <FormField
            label={lang === 'hi' ? 'फसल की मात्रा (क्विंटल)' : 'Quantity to Sell'}
            error={quantityError}
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
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-14 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">
                qtls
              </span>
            </div>
          </FormField>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-3">
            {/* Payment Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600">{lang === 'hi' ? 'भुगतान:' : 'Payment:'}</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-800"
              >
                <option value="all">{lang === 'hi' ? 'सभी शर्तें' : 'All Terms'}</option>
                <option value="immediate">{lang === 'hi' ? 'तुरंत भुगतान (UPI/Cash)' : 'Immediate (UPI/RTGS)'}</option>
                <option value="next_day">{lang === 'hi' ? '24 घंटे के भीतर' : 'Within 24 Hours'}</option>
              </select>
            </div>

            {/* Farmgate Pickup Toggle */}
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={pickupOnly}
                onChange={(e) => setPickupOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
              />
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              {lang === 'hi' ? 'खेत से उठान उपलब्ध' : 'Farmgate Pickup Available'}
            </label>

            {/* Verified KYC Toggle */}
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              {lang === 'hi' ? 'केवल सत्यापित खरीदार' : 'Verified Buyers Only'}
            </label>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-600">{lang === 'hi' ? 'क्रम:' : 'Sort By:'}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs font-medium text-slate-800"
            >
              <option value="price-desc">{lang === 'hi' ? 'उच्चतम भाव पहले' : 'Highest Offer Price'}</option>
              <option value="distance-asc">{lang === 'hi' ? 'निकटतम दूरी पहले' : 'Shortest Distance'}</option>
              <option value="rating-desc">{lang === 'hi' ? 'सर्वश्रेष्ठ रेटिंग' : 'Highest Rating'}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Comparison Drawer Trigger Bar (if 2 selected) */}
      {comparedBuyerIds.length > 0 && (
        <div className="bg-krishi-50 border border-krishi-200 rounded-lg p-3 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-medium text-krishi-900">
            <span className="w-5 h-5 rounded-full bg-krishi-700 text-white flex items-center justify-center font-bold text-xs">
              {comparedBuyerIds.length}
            </span>
            <span>{comparedBuyerIds.length === 1 ? '1 buyer selected for comparison' : '2 buyers selected for side-by-side comparison!'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="text-xs py-1 px-2.5"
              onClick={() => setComparedBuyerIds([])}
            >
              Clear
            </Button>
            {comparedBuyerIds.length === 2 && (
              <Button
                variant="primary"
                className="text-xs py-1 px-3"
                onClick={() => setShowComparisonModal(true)}
              >
                View Side-by-Side Comparison
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Matching Buyers List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{lang === 'hi' ? 'उपलब्ध खरीदार ऑफर' : 'Matching Buyer Offers'}</span>
            <span className="text-xs font-normal text-slate-500">({filteredBuyers.length} buyers found)</span>
          </h2>
          <span className="text-xs text-slate-500">
            {lang === 'hi' ? 'चुनें और शुद्ध मुनाफा कैलकुलेट करें' : 'Select an offer to compute net take-home earnings'}
          </span>
        </div>

        {filteredBuyers.length === 0 ? (
          <Card className="text-center py-10 border-dashed border-2 border-slate-300">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">
              {lang === 'hi' ? 'कोई खरीदार नहीं मिला' : 'No Matching Buyers Found'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your filter options (such as disabling the farmgate pickup filter or choosing all payment terms).
            </p>
            <Button
              variant="outline"
              className="mt-4 text-xs"
              onClick={() => {
                setPaymentFilter('all');
                setPickupOnly(false);
                setVerifiedOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredBuyers.map((buyer) => {
              const isBest = bestBuyer && buyer.id === bestBuyer.id;
              const priceDiff = buyer.offeredPricePerQuintal - mandiPriceNum;
              const isComparing = comparedBuyerIds.includes(buyer.id);
              const qtyFits = parsedQty >= buyer.minQuantityQuintals && parsedQty <= buyer.maxQuantityQuintals;

              return (
                <Card
                  key={buyer.id}
                  className={`flex flex-col justify-between transition-all hover:shadow-md ${
                    isBest ? 'ring-2 ring-emerald-500 bg-emerald-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Name, Verified Badge, Rating */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isBest && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-emerald-600 text-white rounded-full">
                              <Sparkles className="w-3 h-3" />
                              Highest Offer
                            </span>
                          )}
                          {buyer.verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold bg-sky-100 text-sky-800 rounded-full">
                              <ShieldCheck className="w-3 h-3 text-sky-600" />
                              Verified KYC (Demo)
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-1">{buyer.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {buyer.type} • {buyer.district}, {buyer.state} ({buyer.distanceKm} km away)
                        </p>
                      </div>

                      {/* Rating & Compare Checkbox */}
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{buyer.rating}</span>
                          <span className="text-[10px] text-amber-700 font-normal">({buyer.reviewCount})</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleComparison(buyer.id)}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-all ${
                            isComparing
                              ? 'bg-krishi-600 text-white border-krishi-700'
                              : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {isComparing ? '✓ Comparing' : '+ Compare'}
                        </button>
                      </div>
                    </div>

                    {/* Price Offer & Mandi Comparison */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200/90 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Offered Bid:</span>
                        <div className="text-right">
                          <span className="text-2xl font-black text-slate-900">
                            {formatCurrency(buyer.offeredPricePerQuintal)}
                          </span>
                          <span className="text-xs font-normal text-slate-500"> / quintal</span>
                        </div>
                      </div>

                      {/* Spread vs Mandi */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-500">vs. Mandi ({formatCurrency(mandiPriceNum)}):</span>
                        <span
                          className={`font-bold ${
                            priceDiff > 0
                              ? 'text-emerald-600'
                              : priceDiff === 0
                              ? 'text-slate-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {priceDiff > 0 ? `+${formatCurrency(priceDiff)}/qtl higher` : priceDiff === 0 ? 'Exact match' : `${formatCurrency(priceDiff)}/qtl`}
                        </span>
                      </div>

                      {/* Est. Gross for Entered Quantity */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Gross Value ({parsedQty} qtls):</span>
                        <span className="font-extrabold text-slate-900">
                          {formatCurrency(buyer.offeredPricePerQuintal * parsedQty)}
                        </span>
                      </div>
                    </div>

                    {/* Terms: Payment, Pickup, Quantity Range */}
                    <div className="text-xs space-y-1.5 text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">Payment: </span>
                          <span>{buyer.paymentTerms}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-sky-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">Logistics: </span>
                          <span>
                            {buyer.pickupAvailable
                              ? `Farmgate pickup offered (+₹${buyer.pickupChargePerQuintal}/qtl)`
                              : 'Self-delivery required at mill warehouse'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-800">Lot Capacity: </span>
                          <span>{buyer.minQuantityQuintals} – {buyer.maxQuantityQuintals} quintals </span>
                          {qtyFits ? (
                            <span className="text-emerald-700 font-bold">(Your {parsedQty} qtls fits!)</span>
                          ) : (
                            <span className="text-rose-600 font-medium">({parsedQty} qtls outside capacity)</span>
                          )}
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                        <strong>Procurement Note:</strong> {buyer.requirementNotes}
                      </div>

                      {/* Fictional contact */}
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                        <Phone className="w-3 h-3" />
                        <span>Contact: {buyer.contactPerson} ({buyer.contactPhone})</span>
                      </div>
                    </div>
                  </div>

                  {/* Forward Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Button
                      variant={isBest ? 'primary' : 'outline'}
                      className="w-full text-xs py-2 justify-center"
                      icon={ArrowRight}
                      onClick={() => handleProceedToCalculator(buyer)}
                    >
                      {lang === 'hi' ? 'शुद्ध मुनाफा कैलकुलेट करें (Step 4)' : 'Calculate Take-Home Return'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Modal */}
      {showComparisonModal && comparedBuyerObjects.length === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                Side-by-Side Offer Comparison
              </h3>
              <button
                type="button"
                onClick={() => setShowComparisonModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {comparedBuyerObjects.map((b) => (
                <div key={b.id} className="border border-slate-200 rounded-lg p-3 space-y-3 bg-slate-50/50">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{b.name}</h4>
                    <p className="text-slate-500">{b.type}</p>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                    <div className="text-slate-500 font-semibold">Offer Price:</div>
                    <div className="text-xl font-black text-slate-900">
                      {formatCurrency(b.offeredPricePerQuintal)}/qtl
                    </div>
                    <div className="text-slate-600 font-medium">
                      Gross: {formatCurrency(b.offeredPricePerQuintal * parsedQty)} for {parsedQty} qtls
                    </div>
                  </div>

                  <div className="space-y-1 text-slate-700">
                    <div><strong>Distance:</strong> {b.distanceKm} km ({b.location})</div>
                    <div><strong>Payment:</strong> {b.paymentTerms}</div>
                    <div><strong>Pickup:</strong> {b.pickupAvailable ? 'Yes (Farmgate)' : 'No (Self delivery)'}</div>
                    <div><strong>Rating:</strong> {b.rating} ⭐ ({b.reviewCount} reviews)</div>
                  </div>

                  <Button
                    variant="primary"
                    className="w-full text-xs py-1.5 justify-center mt-2"
                    icon={ArrowRight}
                    onClick={() => {
                      setShowComparisonModal(false);
                      handleProceedToCalculator(b);
                    }}
                  >
                    Select this Buyer
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() => setShowComparisonModal(false)}
              >
                Close Comparison
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Demo Stepper Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <Link to={`/market-prices?crop=${selectedCropId}&location=${selectedLocationId}&quantity=${parsedQty}`}>
          <Button variant="secondary" icon={ArrowLeft}>
            {lang === 'hi' ? 'पिछला: चरण 2 (स्मार्ट मंडी भाव)' : 'Back: Step 2 (Market Prices)'}
          </Button>
        </Link>

        <Button
          variant="primary"
          icon={ArrowRight}
          onClick={() => handleProceedToCalculator(bestBuyer)}
        >
          {lang === 'hi'
            ? 'अगला: चरण 4 (शुद्ध मुनाफा कैलकुलेटर)'
            : 'Next: Step 4 (Net Return Calculator)'}
        </Button>
      </div>
    </div>
  );
}
