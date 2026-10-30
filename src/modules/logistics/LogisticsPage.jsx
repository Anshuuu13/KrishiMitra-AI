import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Scale,
  Sparkles,
  Phone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  DollarSign,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import SimulatedDataBadge from '../../shared/components/SimulatedDataBadge';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Badge from '../../shared/components/Badge';
import FormField from '../../shared/components/FormField';
import { formatCurrency, formatQuantity } from '../../shared/utils/formatCurrency';
import { validatePositiveNumber, validateNonNegativeNumber } from '../../shared/utils/validators';
import { useLanguage } from '../../shared/i18n/LanguageContext';

// Import datasets
import logisticsData from '../../data/logistics.json';

export default function LogisticsPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Query parameters from previous steps
  const queryQty = searchParams.get('quantity') || '50';
  const queryDist = searchParams.get('distance') || '25';
  const queryCrop = searchParams.get('crop') || 'wheat';

  const [quantityInput, setQuantityInput] = useState(queryQty);
  const [distanceInput, setDistanceInput] = useState(queryDist);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null); // auto-detected if null

  // Validation
  const quantityError = validatePositiveNumber(quantityInput, lang === 'hi' ? 'मात्रा' : 'Quantity');
  const distanceError = validateNonNegativeNumber(distanceInput, lang === 'hi' ? 'दूरी' : 'Distance');

  const parsedQty = !quantityError ? Number(quantityInput) : 50;
  const parsedDist = !distanceError ? Number(distanceInput) : 25;

  // Auto-recommend optimal vehicle based on harvest quantity
  const recommendedVehicle = useMemo(() => {
    if (parsedQty <= 10) return logisticsData.vehicles[0]; // Auto Tipper (10 qtl)
    if (parsedQty <= 25) return logisticsData.vehicles[1]; // Bolero Pickup (25 qtl)
    if (parsedQty <= 45) return logisticsData.vehicles[2]; // Tata 407 (45 qtl)
    return logisticsData.vehicles[3]; // Eicher Heavy (100 qtl)
  }, [parsedQty]);

  // Active vehicle (either user selected or auto-recommended)
  const activeVehicle = useMemo(() => {
    if (selectedVehicleId) {
      return logisticsData.vehicles.find((v) => v.id === selectedVehicleId) || recommendedVehicle;
    }
    return recommendedVehicle;
  }, [selectedVehicleId, recommendedVehicle]);

  // Calculate freight breakdown
  const freightCalculation = useMemo(() => {
    const baseFare = activeVehicle.baseFare;
    const distanceCost = parsedDist * activeVehicle.perKmRate;
    const loadingCost = (logisticsData.handlingRates.loadingPerQuintal || 15) * parsedQty;
    const unloadingCost = (logisticsData.handlingRates.unloadingPerQuintal || 15) * parsedQty;
    const totalLogisticsCost = baseFare + distanceCost + loadingCost + unloadingCost;
    const costPerQuintal = parsedQty > 0 ? totalLogisticsCost / parsedQty : 0;

    return {
      baseFare,
      distanceCost,
      loadingCost,
      unloadingCost,
      totalLogisticsCost,
      costPerQuintal: Math.round(costPerQuintal * 10) / 10,
    };
  }, [activeVehicle, parsedDist, parsedQty]);

  // Handle vehicle selection
  const handleSelectVehicle = (vehId) => {
    setSelectedVehicleId(vehId);
  };

  return (
    <div className="space-y-6">
      {/* Header & Simulated Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Demo Step 6 of 6
            </span>
            <span className="text-xs font-medium text-slate-500">Module Owner: Member 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Truck className="w-7 h-7 text-emerald-600" />
            {lang === 'hi' ? 'लॉजिस्टिक्स और परिवहन (Logistics Support)' : 'Logistics & Rural Transport'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {lang === 'hi'
              ? 'वाहन के प्रकार, वहन क्षमता और प्रति किलोमीटर भाड़े की पारदर्शी गणना करें।'
              : 'Estimate transparent freight rates, choose suitable commercial vehicles, and connect to local transporters.'}
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      {/* Interactive Freight Estimator Control Bar */}
      <Card className="bg-slate-50 border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            {lang === 'hi' ? '1. फसल की मात्रा और दूरी दर्ज करें' : '1. Enter Quantity & Delivery Distance'}
          </h2>
          <span className="text-xs text-slate-500">Auto-recommends optimal vehicle tier</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label={lang === 'hi' ? 'फसल की मात्रा (क्विंटल)' : 'Harvest Volume (quintals)'}
            error={quantityError}
            required
          >
            <div className="relative">
              <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                min="1"
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-14 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">qtls</span>
            </div>
          </FormField>

          <FormField
            label={lang === 'hi' ? 'डिलीवरी दूरी (किलोमीटर)' : 'Delivery Distance (km)'}
            error={distanceError}
            required
          >
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="number"
                min="1"
                value={distanceInput}
                onChange={(e) => setDistanceInput(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-14 py-2 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-medium">km</span>
            </div>
          </FormField>
        </div>
      </Card>

      {/* Recommended Vehicle & Estimated Fare Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recommended Vehicle Overview Card */}
        <Card className="lg:col-span-2 border-l-4 border-l-sky-500 bg-gradient-to-br from-white via-white to-sky-50/40 p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-sky-600 text-white rounded-full">
                <Sparkles className="w-3 h-3" />
                Recommended Vehicle for {formatQuantity(parsedQty, 'quintal')}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">{activeVehicle.name}</h3>
              <p className="text-xs text-slate-500">
                Category: {activeVehicle.category} • Capacity: <strong>{activeVehicle.capacityQuintals} quintals ({activeVehicle.capacityTons} Tons)</strong>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500">Freight Rate</span>
              <div className="text-base font-black text-slate-900">₹{activeVehicle.perKmRate} / km</div>
              <span className="text-[11px] text-slate-400">+ ₹{activeVehicle.baseFare} Base</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
            <span className="font-semibold text-slate-700">Suitable For:</span>
            <p className="text-slate-600">{activeVehicle.suitableFor}</p>
          </div>

          {/* Transparent Cost Breakdown */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-slate-400 block text-[10px]">Base Fare</span>
              <span className="font-bold text-slate-800">{formatCurrency(freightCalculation.baseFare)}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-slate-400 block text-[10px]">Distance ({parsedDist} km)</span>
              <span className="font-bold text-slate-800">{formatCurrency(freightCalculation.distanceCost)}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-slate-400 block text-[10px]">Loading (₹15/qtl)</span>
              <span className="font-bold text-slate-800">{formatCurrency(freightCalculation.loadingCost)}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded">
              <span className="text-slate-400 block text-[10px]">Unloading (₹15/qtl)</span>
              <span className="font-bold text-slate-800">{formatCurrency(freightCalculation.unloadingCost)}</span>
            </div>
          </div>
        </Card>

        {/* Total Cost Callout Card */}
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/20 p-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Total Estimated Freight
            </span>
            <div className="mt-2 text-3xl font-black text-emerald-800">
              {formatCurrency(freightCalculation.totalLogisticsCost)}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              For {formatQuantity(parsedQty, 'quintal')} delivered over {parsedDist} km
            </p>

            <div className="mt-3 p-2.5 rounded bg-white border border-slate-200 text-xs">
              <span className="text-slate-500">Effective Cost per Quintal:</span>
              <div className="text-base font-extrabold text-slate-900">
                ₹{freightCalculation.costPerQuintal} / quintal
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200">
            <Link
              to={`/net-return?crop=${queryCrop}&quantity=${parsedQty}&distance=${parsedDist}&vehicle=${activeVehicle.id}`}
            >
              <Button variant="primary" className="w-full text-xs py-2 justify-center" icon={ArrowRight}>
                Use in Net Return Calculator
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Available Vehicles Rate Card Directory */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{lang === 'hi' ? 'उपलब्ध वाहन व रेट कार्ड' : 'Available Commercial Transport Directory'}</span>
            <span className="text-xs font-normal text-slate-500">({logisticsData.vehicles.length} vehicle classes)</span>
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'hi' ? 'अपनी उपज के आकार के अनुसार किसी भी वाहन का चयन करें:' : 'Choose any vehicle category to recalculate freight:'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {logisticsData.vehicles.map((v) => {
            const isRecommended = v.id === recommendedVehicle.id;
            const isSelected = v.id === activeVehicle.id;

            return (
              <Card
                key={v.id}
                className={`flex flex-col justify-between transition-all hover:shadow-md cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-sky-500 bg-sky-50/20'
                    : isRecommended
                    ? 'border-emerald-300 bg-emerald-50/10'
                    : 'border-slate-200'
                }`}
                onClick={() => handleSelectVehicle(v.id)}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">{v.category}</span>
                    {isRecommended && (
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                        Best Fit
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{v.shortName}</h3>

                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Capacity:</span>
                      <span className="font-bold text-slate-800">{v.capacityQuintals} qtls ({v.capacityTons}T)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Freight Rate:</span>
                      <span className="font-extrabold text-slate-900">₹{v.perKmRate} / km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Base Fare:</span>
                      <span className="font-semibold text-slate-700">₹{v.baseFare}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div>Provider: <span className="font-medium text-slate-700">{v.providerName}</span></div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Phone className="w-3 h-3" />
                      <span>{v.contactPerson} ({v.phone})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isSelected ? 'text-sky-700' : 'text-slate-500'}`}>
                    {isSelected ? '✓ Selected' : 'Select Vehicle'}
                  </span>
                  <Badge variant={v.availableNow ? 'success' : 'warning'}>
                    {v.availableNow ? 'Ready' : 'Book 1d Prior'}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Honest Transparency Notice */}
      <Card className="bg-amber-50/50 border-amber-200 p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1">
            <h4 className="font-bold text-amber-900">
              {lang === 'hi' ? '⚖️ सिम्युलेटेड भाड़ा दर नोटिस' : '⚖️ Simulated Freight Rates Notice'}
            </h4>
            <p>
              {lang === 'hi'
                ? 'सभी वाहन दरें और संपर्क नंबर हैकाथॉन डेमो के लिए सिम्युलेटेड हैं। वास्तविक ग्रामीण परिवहन में भाड़ा डीजल की कीमतों, पहाड़ी मार्गों और मौसमी आवक के आधार पर तय होता है।'
                : 'All transport freight rates, vehicle specifications, and driver contacts are simulated sample figures. Real-world rural agricultural logistics involve dynamic negotiation based on diesel prices, return loads, and road quality.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Bottom Demo Stepper Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <Link to="/fpo-support">
          <Button variant="secondary" icon={ArrowLeft}>
            {lang === 'hi' ? 'पिछला: चरण 5 (FPO सहयोग)' : 'Back: Step 5 (FPO Support)'}
          </Button>
        </Link>

        <Link to="/hindi-assistant">
          <Button variant="primary" icon={ArrowRight}>
            {lang === 'hi'
              ? 'अंतिम चरण: हिंदी कृषि सहायक (Hindi Assistant)'
              : 'Explore Step 7: Hindi Farming Assistant'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
