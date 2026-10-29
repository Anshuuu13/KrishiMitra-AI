# Module Interfaces & Data Contracts Guide
> **KrishiMitra AI Cross-Module Communication**
> Written in simple language for teammates (Members 2 & 3).

---

## 🎯 Why We Have This Document
In a modular application, modules shouldn't directly touch each other's code. Instead, when a farmer selects a crop in **Market Prices**, that same crop and quantity should flow smoothly into **Buyer Matching** and then into the **Net Return Calculator**.

We achieve this seamlessly via **URL Query Parameters** and shared contracts in `src/shared/contracts/index.js`.

---

## 🌾 1. Common Query Parameters for the Demo Flow

When navigating between modules, pass state via standard URL parameters:

| Parameter | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `crop` | string | `?crop=wheat` | ID of the selected crop (`wheat`, `rice`, `soybean`, `onion`, `tomato`, `cotton`) |
| `quantity` | number | `&quantity=50` | Harvest volume in quintals (1 quintal = 100 kg) |
| `location` | string | `&location=indore` | Farmer's district or town |
| `mandiPrice` | number | `&mandiPrice=2480` | Modal price selected from Mandi |
| `buyerPrice` | number | `&buyerPrice=2580` | Offered price from selected buyer |
| `buyerId` | string | `&buyerId=buyer-1` | ID of selected buyer from `buyers.json` |
| `distance` | number | `&distance=24` | Distance in kilometers to delivery point |

---

## 🔄 2. Cross-Module Flow Example

### Example Journey:
1. **Market Prices (Member 2):**
   * Farmer selects: Crop = `wheat`, Location = `Indore`.
   * Best Mandi Price found: `₹ 2,480 / quintal` (Indore APMC).
   * Member 2 creates a button:  
     `"Find Buyers for this Crop"` -> navigates to `/buyer-matching?crop=wheat&quantity=50&location=indore&mandiPrice=2480`

2. **Buyer Matching (Member 2):**
   * Reads URL params: `crop = wheat`, `quantity = 50`.
   * Displays matching buyers (e.g., "Malwa Flour Mills Pvt. Ltd." offering `₹ 2,580 / quintal`, distance `24 km`).
   * Member 2 adds a button on buyer card:  
     `"Calculate Net Take-Home Return"` -> navigates to `/net-return?crop=wheat&quantity=50&price=2580&distance=24&buyer=Malwa%20Flour%20Mills&buyerId=buyer-1`

3. **Net Return Calculator (Member 2):**
   * Pre-fills inputs:
     * Gross Revenue = `50 quintals × ₹ 2,580 = ₹ 1,29,000`
     * Estimated Transport = `24 km × ₹ 24/km = ₹ 576`
     * Loading & handling = `50 × ₹ 30 = ₹ 1,500`
     * Mandi Cess / Fee = `₹ 0 (Direct buyer bypasses mandi fee!)`
   * Displays Estimated Net Return = `₹ 1,26,924`.
   * Includes link to **Logistics (Member 3)** to confirm actual truck rates!

4. **Logistics Support (Member 3):**
   * Reads `quantity=50` and recommends vehicle: `Tata 407 (4.5T holds 45-50 quintals)` with estimated fare.

5. **FPO Support (Member 3):**
   * Shows nearby FPOs for the chosen crop (e.g., `Malwa Kisan Samriddhi FPO` for wheat/soybean) with collective selling perks.

---

## 📦 3. Ready-Made JSON Data Files in `src/data/`

All datasets are already structured and ready to import:

| File Path | Description | Intended Module |
| :--- | :--- | :--- |
| `src/data/crops.json` | 6 major crops with MSP, units, Hindi names | Core / All modules |
| `src/data/marketPrices.json` | Mandi APMC rates, locations, min/max/modal prices | Market Prices (Member 2) |
| `src/data/buyers.json` | Commercial buyers, price offers, payment terms, ratings | Buyer Matching (Member 2) |
| `src/data/logistics.json` | Vehicles, freight rates per km, handling fees | Logistics & Net Return |
| `src/data/fpos.json` | Regional FPOs, benefits, collective selling premiums | FPO Support (Member 3) |
| `src/data/cropDoctorRules.json` | Symptom checklists, general guidance, KVK notices | Crop Doctor (Member 3) |
| `src/data/hindiFaq.json` | Categorized rule-based FAQs in clear Hindi | Hindi Assistant (Member 3) |

Every JSON file carries a `"simulated": true` flag and explicit demonstration disclaimers.

---

## 💡 Helper Functions Ready For You

### 1. Currency & Quantity Formatting (`src/shared/utils/formatCurrency.js`)
```javascript
import { formatCurrency, formatQuantity } from '../../shared/utils/formatCurrency';

formatCurrency(2480); // "₹2,480"
formatCurrency(129000); // "₹1,29,000"
formatQuantity(50, 'quintal'); // "50 quintals"
```

### 2. Form Validators (`src/shared/utils/validators.js`)
```javascript
import { validatePositiveNumber, validateNonNegativeNumber, validateRequired } from '../../shared/utils/validators';

validatePositiveNumber(quantity, 'Quantity'); // returns error string or null
validateNonNegativeNumber(cost, 'Transport Cost'); // returns error string or null
validateRequired(location, 'Location'); // returns error string or null
```

### 3. Net Return Calculator (`src/shared/utils/netReturnCalculator.js`)
```javascript
import { calculateNetReturn } from '../../shared/utils/netReturnCalculator';

const result = calculateNetReturn({
  pricePerQuintal: 2580,
  quantityQuintals: 50,
  distanceKm: 24,
  transportCostPerKm: 24,
  loadingPerQuintal: 15,
  unloadingPerQuintal: 15,
  mandiFeePercent: 0, // 0 for direct buyer, 1.5 for mandi
  otherDeductions: 0,
});

console.log(result.estimatedNetReturn); // ₹1,26,924
console.log(result.formulaExplanation);
```

### 4. Shared Contracts & Lists (`src/shared/contracts/index.js`)
```javascript
import { SHARED_CROPS, SHARED_LOCATIONS } from '../../shared/contracts';
```
