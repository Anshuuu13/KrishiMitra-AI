import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Stethoscope,
  Upload,
  Image as ImageIcon,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  Info,
  X,
  FileText,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import SimulatedDataBadge from '../../shared/components/SimulatedDataBadge';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import Badge from '../../shared/components/Badge';
import FormField from '../../shared/components/FormField';
import { useLanguage } from '../../shared/i18n/LanguageContext';

// Import datasets
import cropsData from '../../data/crops.json';
import cropDoctorRules from '../../data/cropDoctorRules.json';

// Sample demo image (data URL of an illustrative agricultural leaf illustration)
const SAMPLE_LEAF_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23ecfdf5"/><path d="M200 40 C120 100 80 180 140 250 C180 270 240 250 260 200 C280 140 270 80 200 40 Z" fill="%2322c55e" stroke="%2315803d" stroke-width="4"/><path d="M200 40 L195 255" stroke="%2315803d" stroke-width="3"/><path d="M198 100 L140 80 M198 140 L130 130 M198 180 L145 190 M198 110 L250 90 M198 150 L260 140 M198 190 L245 200" stroke="%2315803d" stroke-width="2"/><circle cx="160" cy="110" r="14" fill="%23eab308" opacity="0.8"/><circle cx="150" cy="150" r="18" fill="%23eab308" opacity="0.8"/><circle cx="230" cy="130" r="15" fill="%23eab308" opacity="0.8"/><circle cx="220" cy="170" r="12" fill="%23eab308" opacity="0.8"/><text x="200" y="285" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23166534" text-anchor="middle">Sample Leaf Photo with Yellow Rust Spots (Demo)</text></svg>';

export default function CropDoctorPage() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryCrop = searchParams.get('crop') || 'wheat';
  const [selectedCropId, setSelectedCropId] = useState(queryCrop);

  // Image upload state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Symptom checklist state (selected symptom IDs)
  const [selectedSymptomIds, setSelectedSymptomIds] = useState(['s-w-1']);
  const [showAiRoadmap, setShowAiRoadmap] = useState(false);

  // Available crop rules
  const currentCropRules = useMemo(() => {
    return cropDoctorRules.crops[selectedCropId] || cropDoctorRules.crops.wheat;
  }, [selectedCropId]);

  // Handle crop change
  const handleCropChange = (cropId) => {
    setSelectedCropId(cropId);
    // Reset symptoms to first symptom of the new crop
    const newRules = cropDoctorRules.crops[cropId];
    if (newRules && newRules.symptoms.length > 0) {
      setSelectedSymptomIds([newRules.symptoms[0].id]);
    } else {
      setSelectedSymptomIds([]);
    }
    const params = new URLSearchParams(searchParams);
    params.set('crop', cropId);
    setSearchParams(params, { replace: true });
  };

  // Image file change handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError(lang === 'hi' ? 'कृपया केवल छवि (JPG, PNG) अपलोड करें।' : 'Please upload a valid image file (JPG, PNG).');
      return;
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError(lang === 'hi' ? 'छवि का आकार 5MB से कम होना चाहिए।' : 'Image size must be smaller than 5 MB.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);
    setImageMeta({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
    });
  };

  // Load sample demo image button
  const handleLoadSampleImage = () => {
    setUploadError(null);
    setUploadedImage(SAMPLE_LEAF_IMAGE);
    setImageMeta({
      name: `${selectedCropId}-leaf-sample-demo.svg`,
      size: '2.4 KB',
      type: 'image/svg+xml (Sample)',
    });
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageMeta(null);
    setUploadError(null);
  };

  // Toggle symptom selection
  const toggleSymptom = (symptomId) => {
    setSelectedSymptomIds((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  // Active guidance cards matching selected symptoms
  const activeAdvisories = useMemo(() => {
    return currentCropRules.symptoms.filter((s) => selectedSymptomIds.includes(s.id));
  }, [currentCropRules, selectedSymptomIds]);

  return (
    <div className="space-y-6">
      {/* Header & Simulated Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full">
              Demo Step 1 of 6
            </span>
            <span className="text-xs font-medium text-slate-500">Module Owner: Member 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Stethoscope className="w-7 h-7 text-emerald-600" />
            {lang === 'hi' ? 'फसल डॉक्टर (Crop Doctor Advisory)' : 'Crop Doctor Advisory'}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {lang === 'hi'
              ? 'फसल की पत्ती का फोटो अपलोड करें और लक्षण-आधारित प्राथमिक कृषि सलाह प्राप्त करें।'
              : 'Upload crop photos and receive symptom-guided cultural and agricultural advisory.'}
          </p>
        </div>
        <SimulatedDataBadge />
      </div>

      {/* Mandatory Honesty Rule Disclaimer Banner */}
      <Card className="bg-amber-50/90 border-amber-300 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-950">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <span>{lang === 'hi' ? '⚠️ सिम्युलेटेड मार्गदर्शन अस्वीकरण (Honesty Rule)' : '⚠️ Simulated Guidance Disclaimer (Hackathon Rule)'}</span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-200 text-amber-900 rounded">Not a Clinical Diagnosis</span>
            </h4>
            <p>
              {lang === 'hi'
                ? 'यह मॉड्यूल चयनित लक्षणों पर आधारित सामान्य शैक्षिक मार्गदर्शन प्रदान करता है। यह कोई प्रमाणित निदान नहीं है। अंतिम पुष्टि के लिए सदैव नजदीकी कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारी से संपर्क करें।'
                : 'Simulated guidance. Not a verified diagnosis. Consult a local agriculture officer (Krishi Vigyan Kendra - KVK) for definitive laboratory verification.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Main Workspace Grid: Upload & Symptom Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Crop Selection & Image Upload */}
        <div className="space-y-4">
          <Card className="bg-slate-50 border-slate-200 p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-600" />
              {lang === 'hi' ? '1. फसल और पत्ती की फोटो अपलोड करें' : '1. Select Crop & Upload Leaf Photo'}
            </h3>

            {/* Crop Selector */}
            <FormField label={lang === 'hi' ? 'फसल चुनें (Crop)' : 'Select Crop'} required>
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

            {/* Upload Area */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {lang === 'hi' ? 'फसल / पत्ती की फोटो (Image Upload)' : 'Crop / Leaf Image'}
                <span className="text-xs font-normal text-slate-500 ml-1.5">(JPG, PNG, max 5MB)</span>
              </label>

              {!uploadedImage ? (
                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center bg-white transition-all">
                  <ImageIcon className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-700">
                    {lang === 'hi' ? 'छवि यहां ड्रैग करें या फाइल चुनें' : 'Drag and drop image here or click to browse'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Clear close-up photo of the infected leaf or plant part
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        Upload File
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <Button
                      variant="outline"
                      className="text-xs py-1.5"
                      onClick={handleLoadSampleImage}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1" />
                      {lang === 'hi' ? 'डेमो फोटो लोड करें' : 'Load Demo Sample Photo'}
                    </Button>
                  </div>

                  {uploadError && (
                    <p className="text-xs text-rose-600 font-medium mt-2">{uploadError}</p>
                  )}
                </div>
              ) : (
                /* Uploaded Image Preview */
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3">
                  <div className="relative rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center max-h-56">
                    <img
                      src={uploadedImage}
                      alt="Crop leaf preview"
                      className="object-contain max-h-56 w-full"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-all"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span className="truncate max-w-[200px] font-medium text-slate-700">
                      {imageMeta?.name}
                    </span>
                    <span>{imageMeta?.size}</span>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Preview active
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Educational Future AI Roadmap Dropdown */}
          <Card className="bg-slate-50 border-slate-200 p-4">
            <button
              type="button"
              onClick={() => setShowAiRoadmap(!showAiRoadmap)}
              className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-emerald-700"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Technical Roadmap: Real AI Vision Model Integration
              </span>
              {showAiRoadmap ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAiRoadmap && (
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-2 animate-fadeIn">
                <p>
                  <strong>Why we do not claim live AI today:</strong> Per hackathon honesty rules, we refuse to generate fake "94% AI confidence" tags without a real on-device model running.
                </p>
                <p>
                  <strong>Production Architecture Plan:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
                  <li><strong>Model:</strong> MobileNetV3 / EfficientNet fine-tuned on the PlantVillage dataset (54,306 images across 38 crop-disease pairs).</li>
                  <li><strong>Deployment:</strong> Quantized to INT8 (TensorFlow Lite / ONNX Runtime Web) to run directly inside the farmer's mobile browser without cloud latency or server costs.</li>
                  <li><strong>Safety Guardrail:</strong> Always accompanied by human KVK extension verification.</li>
                </ul>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Symptom Checklist & Guidance */}
        <div className="space-y-4">
          <Card className="bg-white border-slate-200 p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                {lang === 'hi' ? '2. देखे गए लक्षण चुनें (Symptom Checklist)' : '2. Observed Symptom Checklist'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'hi'
                  ? 'अपनी फसल में दिखाई दे रहे लक्षणों पर टिक करें:'
                  : `Select symptoms observed on your ${currentCropRules.cropName}:`}
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5">
              {currentCropRules.symptoms.map((symptom) => {
                const isChecked = selectedSymptomIds.includes(symptom.id);
                return (
                  <label
                    key={symptom.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${
                      isChecked
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSymptom(symptom.id)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <div className="space-y-0.5 text-xs">
                      <div className="font-bold text-slate-900">
                        {lang === 'hi' ? symptom.hindiLabel : symptom.label}
                      </div>
                      <div className="text-slate-500">
                        Possible Issue: <span className="font-semibold text-slate-700">{symptom.possibleIssue}</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </Card>

          {/* Guidance Cards for Selected Symptoms */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>{lang === 'hi' ? 'सामान्य प्रबंधन सुझाव' : 'Recommended Management Practices'}</span>
              <span className="text-xs font-normal text-slate-500">({activeAdvisories.length} condition{activeAdvisories.length !== 1 ? 's' : ''})</span>
            </h4>

            {activeAdvisories.length === 0 ? (
              <Card className="text-center py-6 border-dashed border-2 text-slate-400 text-xs">
                Select one or more symptoms above to view cultural guidance.
              </Card>
            ) : (
              activeAdvisories.map((advisory) => (
                <Card key={advisory.id} className="border-l-4 border-l-emerald-600 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Condition</span>
                      <h5 className="text-sm font-bold text-slate-900">{advisory.possibleIssue}</h5>
                      {advisory.scientificName && (
                        <p className="text-[11px] text-slate-500 italic">Scientific: {advisory.scientificName}</p>
                      )}
                    </div>
                    <Badge variant={advisory.severity === 'High' ? 'danger' : advisory.severity === 'Medium' ? 'warning' : 'info'}>
                      {advisory.severity} Severity
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                    {advisory.generalGuidance}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <span className="font-semibold text-slate-800">Practical Cultural Actions:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
                      {advisory.culturalSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Expert Extension / KVK Helpline Card */}
          <Card className="bg-emerald-50/70 border-emerald-300 p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>Free Government Agricultural Expert Support</span>
            </div>
            <p className="text-xs text-slate-700">
              Need immediate official verification? Contact the national <strong>Kisan Call Centre (KCC)</strong>:
            </p>
            <div className="flex items-center justify-between pt-1">
              <div className="text-sm font-extrabold text-emerald-900">
                📞 1800-180-1551 <span className="text-xs font-normal text-slate-600">(Toll-Free, 6 AM - 10 PM)</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                22 Indian Languages
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Demo Stepper Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <Link to="/dashboard">
          <Button variant="secondary">
            {lang === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
          </Button>
        </Link>

        <Link to={`/market-prices?crop=${selectedCropId}`}>
          <Button variant="primary" icon={ArrowRight}>
            {lang === 'hi'
              ? `चरण 2 पर जाएं: ${currentCropRules.cropName} के मंडी भाव`
              : `Proceed to Step 2: Market Prices for ${currentCropRules.cropName}`}
          </Button>
        </Link>
      </div>
    </div>
  );
}
