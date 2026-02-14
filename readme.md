# TaxTrace V1 - Backend Manifest

## 📌 Project Overview
TaxTrace is a crowdsourced backend system designed to track indirect taxes (GST) on consumer goods. It compares tax expenditures against a user's hourly work income to visualize "tax work time."

## 🛠 Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT & BcryptJS
- **API Client:** Axios (OpenFoodFacts API)

## 📂 System Architecture (MVC)
- `src/models`: Database schemas (Mongoose)
- `src/controllers`: Request handling & orchestration
- `src/services`: External API communication (OpenFoodFacts)
- `src/utils`: Mathematical logic (GST formulas)
- `src/middleware`: Auth & Error handling

## 🧮 Core Logic: GST Calculation
Since MRP includes GST, we use the reverse calculation:
- **Price without GST** = `Price / (1 + GST_Rate / 100)`
- **GST Amount** = `Price - Price_without_GST`

## 🛣 API Roadmap
### Auth
- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login

### Products & Scans
- `POST /api/products/lookup` - Barcode check (DB or External)
- `POST /api/scans` - Record a purchase & update product avg price

### Analytics
- `GET /api/summary/daily` - Daily tax vs income metrics
- `GET /api/summary/monthly` - Monthly tax vs income metrics

---
*Status: Phase 1 Setup (In Progress)*
### 3.1 User Model
- **name**: String
- **email**: String (Unique)
- **password**: String (Hashed via Bcrypt)
- **monthlyIncome**: Number (Used for GST/Work-hour math)
- **workDaysPerMonth**: Number (Default: 20)
- **workHoursPerDay**: Number (Default: 8)

### ✅ Phase 2: Authentication Module (Completed)
- **User Model**: Defined with Bcrypt password hashing.
- **JWT Implementation**: Token-based stateless authentication.
- **Middleware**: Created `protect` middleware to secure private routes.
- **Endpoints**:
  - `POST /api/auth/register` (Public)
  - `POST /api/auth/login` (Public)

  ### ✅ Phase 3: Product Lookup System (Completed)
- **Product Model**: Barcode-indexed storage with crowd-pricing fields.
- **Service Layer**: Axios integration with OpenFoodFacts.
- **Lookup Logic**: Hybrid approach (Database first, then External API).

### ✅ Phase 4: Scan & Crowdsourcing Logic (Completed)
- **Scan Model**: Established to link Users, Products, and Tax data.
- **GST Utility**: Implemented reverse GST math.
- **Crowdsourcing Engine**: Product average prices update dynamically on every scan.
- **Endpoints**:
  - `POST /api/scans` (Private)

  ### ✅ Phase 5: Daily Summary API (Completed)
- **Aggregation**: Queries scans within a 24-hour window.
- **Economic Logic**:
  - `Daily Income = monthlyIncome / workDaysPerMonth`
  - `Hourly Rate = Daily Income / workHoursPerDay`
  - `Tax Work Time = Total GST / Hourly Rate`
- **Endpoints**:
  - `GET /api/summary/daily` (Private)

  ### ✅ Phase 6: Monthly Summary API (Completed)
- **Time Range**: Aggregates all data from the 1st of the current month.
- **Metric**: "Work Days for Tax" — calculates how many full days of labor were spent paying GST.
- **Endpoints**:
  - `GET /api/summary/monthly` (Private)

  ## 🧪 Testing & Validation (Phase 7)
- [x] **Auth Check**: Verified JWT protection on all private routes.
- [x] **Math Validation**: Verified reverse GST calculation accuracy.
- [x] **Edge Case**: Handled 0 income users (prevented division by zero).
- [x] **Persistence**: Verified Product avgPrice updates on multiple user scans.

### ✅ Phase 8: Income Comparison Scenarios (Completed)
- **Feature**: Added relative tax-work-time metrics for different income brackets (30k, 60k, 100k+).
- **Purpose**: Provides perspective on tax burden across different socio-economic levels.
## 🚀 Deployment Ready
- Environment variables isolated in `.env`.
- Modular MVC structure for easy scaling.
- Clean JSON responses for frontend integration.