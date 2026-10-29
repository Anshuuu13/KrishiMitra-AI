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
 * @property {string} category - "Grain" | "Vegetable" | "Oilseed" | "Pulse"
 * @property {string} defaultUnit - "quintal" (100 kg)
 * @property {number} msp - Minimum Support Price in INR (if applicable)
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
 * @property {string} date - Simulated date (YYYY-MM-DD)
 * @property {boolean} simulated - Always true for hackathon
 */

/**
 * @typedef {Object} BuyerOfferItem
 * @property {string} id
 * @property {string} buyerName - Name of trader, miller, or enterprise
 * @property {string} buyerType - "Flour Mill" | "Retail Chain" | "Wholesale Trader" | "Food Processor"
 * @property {string} cropId
 * @property {number} offeredPricePerQuintal - Offered price in ₹
 * @property {number} minQuantityQuintals - Minimum buy order
 * @property {number} maxQuantityQuintals - Maximum capacity
 * @property {string} paymentTerms - e.g. "Immediate UPI / Bank Transfer", "Within 48 hours"
 * @property {string} location
 * @property {number} distanceKm
 * @property {number} rating - 1.0 to 5.0
 * @property {boolean} verified - Whether buyer KYC is verified
 * @property {boolean} simulated - Always true
 */

/**
 * @typedef {Object} NetReturnCalculation
 * @property {number} grossRevenue - Price * Quantity
 * @property {number} transportCost - Distance * ratePerKm or flat quote
 * @property {number} loadingUnloadingCost - Per quintal loading charge
 * @property {number} mandiOrPlatformFee - Market cess or service charge
 * @property {number} storageOrPackingCost - Optional packaging cost
 * @property {number} totalDeductions - Sum of all expenses
 * @property {number} estimatedNetReturn - grossRevenue - totalDeductions
 * @property {number} netPerQuintal - estimatedNetReturn / quantity
 * @property {string} formulaExplanation - Visible transparent explanation
 */

/**
 * @typedef {Object} TransportOptionItem
 * @property {string} id
 * @property {string} vehicleType - "Tata Ace (Chota Hathi)" | "Pickup (1.5T)" | "Canter (4T)" | "Heavy Truck (10T)"
 * @property {number} capacityQuintals
 * @property {number} baseFare
 * @property {number} perKmRate
 * @property {string} providerName - Transporter name (simulated)
 * @property {string} contactInfo - Sample contact
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
 * @property {string} keyBenefit - e.g. "Bulk fertilizer discount + collective selling"
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
