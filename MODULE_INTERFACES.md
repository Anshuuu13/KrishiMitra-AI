# Module Interfaces & Data Contracts Guide
> **KrishiMitra AI Cross-Module Communication**
> Written in simple language for teammates (Members 2 & 3).

---

## 🎯 Why We Have This Document
In a modular application, modules shouldn't directly touch each other's code. Instead, when a farmer selects a crop in **Market Prices**, that same crop and quantity should flow smoothly into **Buyer Matching** and then into the **Net Return Calculator**.

We achieve this seamlessly via **URL Query Parameters** or shared contracts in `src/shared/contracts/index.js`.

---

## 🌾 1. Common Query Parameters for the Demo Flow

When navigating between modules, pass state via standard URL parameters:

| Parameter | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `crop` | string | `?crop=wheat` | ID of the selected crop (`wheat`, `rice`, `soybean`, `onion`, `tomato`, `cotton`) |
| `quantity` | number | `&quantity=50` | Harvest volume in quintals (1 quintal = 100 kg) |
| `location` | string | `&location=Indore` | Farmer's district or town |
| `mandiPrice` | number | `&mandiPrice=2450` | Modal price selected from Mandi |
| `buyerPrice` | number | `&buyerPrice=2580` | Offered price from selected buyer |
| `distance` | number | `&distance=35` | Distance in kilometers to delivery point |

---

## 🔄 2. Cross-Module Flow Example

### Example Journey:
1. **Market Prices (Member 2):**
   * Farmer selects: Crop = `wheat`, Location = `Indore`.
   * Best Mandi Price found: `₹ 2,450 / quintal`.
   * Member 2 creates a button:  
     `"Find Buyers for this Crop"` -> navigates to `/buyer-matching?crop=wheat&quantity=50&location=Indore&mandiPrice=2450`

2. **Buyer Matching (Member 2):**
   * Reads URL params: `crop = wheat`, `quantity = 50`.
   * Displays matching buyers (e.g., "Malwa Flour Mill" offering `₹ 2,580 / quintal`, distance `25 km`).
   * Member 2 adds a button on buyer card:  
     `"Calculate Net Take-Home Return"` -> navigates to `/net-return?crop=wheat&quantity=50&price=2580&distance=25&buyer=Malwa%20Flour%20Mill`

3. **Net Return Calculator (Member 2):**
   * Pre-fills inputs:
     * Gross Revenue = `50 quintals × ₹ 2,580 = ₹ 1,29,000`
     * Estimated Transport = `25 km × ₹ 40/km = ₹ 1,000`
     * Loading & handling = `50 × ₹ 15 = ₹ 750`
     * Mandi Cess / Fee = `₹ 0 (Direct buyer bypasses mandi fee!)`
   * Displays Estimated Net Return = `₹ 1,27,250`.
   * Includes link to **Logistics (Member 3)** to confirm actual truck rates!

4. **Logistics Support (Member 3):**
   * Reads `quantity=50` and recommends vehicle: `Pickup 1.5T (holds 30-50 quintals)` with estimated fare.

---

## 📦 3. Data Shapes (from `src/shared/contracts/index.js`)

### A. Crop Model
```javascript
{
  id: "wheat",
  name: "Wheat",
  hindiName: "गेहूं",
  category: "Cereal",
  defaultUnit: "quintal",
  msp: 2275 // Minimum Support Price in INR
}
```

### B. Mandi Price Model
```javascript
{
  id: "mandi-indore-wheat",
  cropId: "wheat",
  mandiName: "Indore Mandi (APMC)",
  district: "Indore",
  state: "Madhya Pradesh",
  distanceKm: 18,
  modalPrice: 2450,
  minPrice: 2380,
  maxPrice: 2520,
  date: "2026-10-29",
  simulated: true
}
```

### C. Buyer Offer Model
```javascript
{
  id: "buyer-malwa-mill",
  buyerName: "Malwa Flour Mill Ltd.",
  buyerType: "Flour Mill",
  cropId: "wheat",
  offeredPricePerQuintal: 2580,
  minQuantityQuintals: 20,
  maxQuantityQuintals: 200,
  paymentTerms: "Direct Bank Transfer on delivery",
  location: "Pithampur Industrial Area, Indore",
  distanceKm: 28,
  rating: 4.8,
  verified: true,
  simulated: true
}
```

### D. Logistics Vehicle Model
```javascript
{
  id: "veh-pickup-1-5t",
  vehicleType: "Bolero Pickup (1.5 Ton)",
  capacityQuintals: 30,
  baseFare: 500,
  perKmRate: 35,
  simulated: true
}
```

### E. FPO Model
```javascript
{
  id: "fpo-krishna-valley",
  name: "Krishna Valley Farmers Producer Co.",
  block: "Sanwer",
  district: "Indore",
  memberCount: 420,
  focusCrops: ["wheat", "soybean", "onion"],
  keyBenefit: "Collective grain storage & bulk fertilizer discount",
  simulated: true
}
```

---

## 💡 Helper Functions Ready For You
Import from `src/shared/utils/formatCurrency.js` and `validators.js`:
```javascript
import { formatCurrency, formatQuantity } from '../../shared/utils/formatCurrency';
import { validatePositiveNumber } from '../../shared/utils/validators';

formatCurrency(2450); // "₹2,450"
formatQuantity(50, 'quintal'); // "50 quintals"
```
