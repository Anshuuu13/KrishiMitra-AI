# KrishiMitra AI (कृषिमित्र AI)
> **Smarter Farming Decisions. Transparent Selling Choices. Fairer Returns for Indian Farmers.**
> *Built for a 10-Hour Startup Hackathon by a 3-Member Engineering Team.*

---

## 🌾 1. Project Overview & Philosophy

Indian farmers face compound challenges across the harvest lifecycle:
* Crop health issues and pests causing yield losses.
* Opaque and fluctuating local APMC mandi prices.
* Dependence on single local buyers without alternative offers.
* Hidden logistics and handling deductions eroding net earnings.

### Our Solution
**KrishiMitra AI** brings together crop health advisory, transparent mandi price comparisons, verified buyer matching, formula-backed net return calculation, FPO collective selling, and local logistics in one simple, mobile-friendly app.

### Intermediary Philosophy
> **We do NOT eliminate intermediaries.** 
> Local traders, transporters, and storage facilities perform vital rural services. Our mission is **transparency and choice**: removing information asymmetries, giving farmers multiple options, reducing unnecessary layers, and helping farmers calculate their true take-home earnings upfront.

---

## ⚖️ 2. Honesty & Transparency Notice (Hackathon Rules)

In accordance with strict hackathon honesty rules, this prototype features:
* **Prominent UI Badges:** Every screen and module displaying mock data features a visible **`[Sample / Simulated Data (Demo)]`** badge.
* **Simulated Datasets:**
  * **Market Prices:** Sample mandi rates across Madhya Pradesh, Maharashtra, and UP. Not real-time live APMC feeds.
  * **Buyer Directory:** Illustrative sample enterprises (e.g., "Malwa Flour Mill", "Kisan Agro Foods"). Fictional contacts for demonstration.
  * **Transport & Logistics:** Illustrative vehicle types and freight rate estimators based on distance.
  * **FPO Directory:** Representative Farmer Producer Organizations.
* **Crop Doctor Advisory Disclaimer:**
  * Crop Doctor does **not** claim to provide verified diagnostic predictions.
  * It provides general symptom-based educational guidance with the prominent disclaimer:  
    *`"Simulated guidance. Not a verified diagnosis. Consult your local agriculture officer (Krishi Vigyan Kendra - KVK)."`*
* **Net Return Formula Transparency:** All calculations show the transparent mathematical breakdown:  
  `Net Return = (Offered Price × Quantity) - (Transport + Loading/Unloading + Mandi Fees + Storage)`
* **Hindi Assistant:** Rule-based FAQ guidance with prewritten farming advisories in clear Hindi.

---

## 👥 3. Team Responsibilities & Ownership

| Member | Role | Modules & Responsibilities |
| :--- | :--- | :--- |
| **Member 1 (Team Leader)** | Core & Integration | Project architecture, `src/core/`, Layout, Stepper, Navigation, Shared Components, Git workflow, integration. |
| **Member 2** | Pricing & Finance | `src/modules/market-prices/`, `src/modules/buyer-matching/`, `src/modules/net-return/`. |
| **Member 3** | Advisory & Logistics | `src/modules/crop-doctor/`, `src/modules/fpo-support/`, `src/modules/logistics/`, `src/modules/hindi-assistant/`. |

---

## 🚀 4. How to Run Locally

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)
* **Git**

### Installation Steps
```bash
# 1. Clone repository (or navigate into project directory)
cd KrishiMitra-AI

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will launch at `http://localhost:5173`.

### Running Tests
```bash
npm test
```

### Production Build
```bash
npm run build
```

---

## 🧭 5. Judge Demo Flow (Step-by-Step)

Judges can test the platform through the sequential workflow:
1. **Dashboard (`/dashboard`):** Command center and overview stepper.
2. **Step 1: Crop Doctor (`/crop-doctor`):** Crop image preview and symptom checklist.
3. **Step 2: Smart Market Prices (`/market-prices`):** Regional APMC mandi price comparison.
4. **Step 3: Buyer Matching (`/buyer-matching`):** Direct buyer offer discovery and comparison.
5. **Step 4: Net Return Calculator (`/net-return`):** Formula-backed take-home profit estimator.
6. **Step 5: FPO Support (`/fpo-support`):** Collective bargaining and group benefits.
7. **Step 6: Logistics Support (`/logistics`):** Vehicle capacities and per-km freight quotes.
8. **Farming Assistant (`/hindi-assistant`):** Quick farming FAQs in Hindi.

---

## 🛠️ 6. Tech Stack
* **Vite + React (JavaScript / JSX):** Fast, modern single-page app without TypeScript friction during hackathon.
* **Tailwind CSS:** Responsive, mobile-first agricultural theme.
* **React Router v7:** Dynamic routing with unified layout.
* **Lucide React:** Lightweight agricultural, transport, and finance icons.
* **Vitest:** Instant unit testing for calculations and form validators.
