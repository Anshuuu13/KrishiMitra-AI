/**
 * Shared Data Contracts & Schemas for KrishiMitra AI
 * 
 * Rules for Team Members:
 * - Member 1 (Lead/Core): App, Layout, Navigation, Registry
 * - Member 2: Market Prices, Buyer Matching, Net Return Calculator
 * - Member 3: Crop Doctor, FPO Support, Logistics, Hindi Assistant
 * 
 * All cross-module communication uses these exact property names.
 */

/**
 * @typedef {Object} CropItem
 * @property {string} id - Unique crop ID (e.g. "wheat", "rice", "tomato")
 * @property {string} name - English display name
 * @property {string} hindiName - Hindi display name
 * @property {string} category - "Grain" | "Vegetable" | "Oilseed" | "Cash Crop"
 * @property {string} defaultUnit - "quintal" (100 kg)
 * @property {number|null} msp - Minimum Support Price in INR (if applicable)
 */

/**
 * @typedef {Object} MandiPriceItem
 * @property {string} id
 * @property {string} cropId
 * @property {string} mandiName - Name of the APMC / Mandi market
 * @property {string} district
 * @property {string} state
 * @property {number} distanceKm - Distance from user farm in km
 * @property {number} modalPrice - Prevailing market rate (₹/quintal)
 * @property {number} minPrice
 * @property {number} maxPrice
 * @property {number|null} msp
 * @property {number} arrivalVolumeQuintals
 * @property {number} mandiFeePercent
 * @property {string} trend - "up" | "down" | "stable"
 * @property {string} date - Simulated date (YYYY-MM-DD)
 * @property {boolean} simulated - Always true for hackathon
 */

/**
 * @typedef {Object} BuyerOfferItem
 * @property {string} id
 * @property {string} name - Name of trader, miller, or enterprise
 * @property {string} type - "Flour Mill / Processor" | "Retail Chain" | "Export Aggregator"
 * @property {string} cropId
 * @property {number} offeredPricePerQuintal - Offered price in ₹
 * @property {number} minQuantityQuintals - Minimum buy order
 * @property {number} maxQuantityQuintals - Maximum capacity
 * @property {string} paymentTerms - e.g. "Immediate UPI / Bank Transfer", "Within 24 Hours"
 * @property {string} location
 * @property {number} distanceKm
 * @property {number} rating - 1.0 to 5.0
 * @property {boolean} verified - Whether buyer KYC is verified
 * @property {boolean} pickupAvailable - Whether buyer arranges farmgate pickup
 * @property {boolean} simulated - Always true
 */

/**
 * @typedef {Object} NetReturnCalculation
 * @property {number} grossRevenue - Price * Quantity
 * @property {number} transportCost - Distance * ratePerKm or flat quote
 * @property {number} handlingCost - Per quintal loading + unloading charge
 * @property {number} mandiFee - Market cess or service charge
 * @property {number} otherDeductions - Optional packaging/storage cost
 * @property {number} totalDeductions - Sum of all expenses
 * @property {number} estimatedNetReturn - grossRevenue - totalDeductions
 * @property {number} netPricePerQuintal - estimatedNetReturn / quantity
 * @property {string} formulaExplanation - Visible transparent explanation
 */

/**
 * @typedef {Object} TransportOptionItem
 * @property {string} id
 * @property {string} name - Vehicle name (e.g. "Mahindra Bolero Maxi Truck")
 * @property {string} shortName
 * @property {number} capacityQuintals
 * @property {number} capacityTons
 * @property {number} baseFare
 * @property {number} perKmRate
 * @property {string} providerName - Transporter name (simulated)
 * @property {boolean} simulated - Always true
 */

/**
 * @typedef {Object} FpoItem
 * @property {string} id
 * @property {string} name - FPO registered name
 * @property {string} block
 * @property {string} district
 * @property {string} state
 * @property {number} memberCount - Number of member farmers
 * @property {string[]} focusCrops - List of primary crops handled
 * @property {string[]} keyBenefits - Bullet points of services
 * @property {string} collectiveSellingBonus
 * @property {boolean} simulated - Always true
 */

export const SHARED_CROPS = [
  { id: 'wheat', name: 'Wheat (गेहूं)', hindiName: 'गेहूं', category: 'Grain', defaultUnit: 'quintal', msp: 2275 },
  { id: 'rice', name: 'Paddy / Rice (धान)', hindiName: 'धान', category: 'Grain', defaultUnit: 'quintal', msp: 2183 },
  { id: 'soybean', name: 'Soybean (सोयाबीन)', hindiName: 'सोयाबीन', category: 'Oilseed', defaultUnit: 'quintal', msp: 4600 },
  { id: 'onion', name: 'Onion (प्याज)', hindiName: 'प्याज', category: 'Vegetable', defaultUnit: 'quintal', msp: null },
  { id: 'tomato', name: 'Tomato (टमाटर)', hindiName: 'टमाटर', category: 'Vegetable', defaultUnit: 'quintal', msp: null },
  { id: 'cotton', name: 'Cotton (कपास)', hindiName: 'कपास', category: 'Cash Crop', defaultUnit: 'quintal', msp: 7020 },
];

export const SHARED_LOCATIONS = [
  { id: 'indore', name: 'Indore', district: 'Indore', state: 'Madhya Pradesh', isDefault: true },
  { id: 'ujjain', name: 'Ujjain', district: 'Ujjain', state: 'Madhya Pradesh' },
  { id: 'dewas', name: 'Dewas', district: 'Dewas', state: 'Madhya Pradesh' },
  { id: 'nashik', name: 'Nashik', district: 'Nashik', state: 'Maharashtra' },
  { id: 'pune', name: 'Pune', district: 'Pune', state: 'Maharashtra' },
  { id: 'lucknow', name: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh' },
];
