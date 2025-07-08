# 🏗️ Real Estate Contract Automation Backend (WIP)

This backend powers the contract automation system for a real estate platform. It's built with Node.js and MongoDB, and its primary purpose is to dynamically generate legally formatted PDFs by injecting offer data into pre-mapped contract templates.

It replaces manual, error-prone workflows with automated document generation, using real-time data pulled from a database. Originally built to streamline internal operations for a small real estate team.

---

## 🔑 Key Features

### 📝 PDF Contract Generation
Located in [`routes/templates.js`](./routes/templates.js)

- Fetches offer data from MongoDB
- Loads a static PDF template using `pdf-lib`
- Injects values for:

#### 🏡 Property & Buyer Info
- Buyer names (supports multiple buyers)
- Street address (smart wrapping over multiple fields)
- Full property address line
- Municipality (City/Town/Village)
- County

#### 💰 Financials
- Purchase price (numeric and written in uppercase words)
- Earnest money amount
- Days to deposit earnest money
- Earnest money holder

#### 🗓 Dates
- Drafted date (auto-filled)
- Binding acceptance deadline
- Proposed closing date
- Property Condition Report / RECR date

#### 📦 Inclusions & Exclusions
- Items included in the sale (dynamically split across lines)
- Items excluded from the sale

#### 📑 Contingencies

**Inspection**
- `InspectionCheck` – Whether the buyer is requesting an inspection

**Financing**
- `FinancingCheck` – Financing contingency status
- `FinancingLoanType` – Type of financing (e.g. FHA, VA, Conventional)
- `DaysForFinancing` – Time allowed for buyer to secure financing
- `FinancingYears`, `YearsForFinancing` – Loan duration
- `FinancingAmount` – Loan amount
- `FinancingMonthlyPayment` – Monthly payment
- `FixedRateFinancingCheck` – Indicates fixed-rate loan
- `SellerFinancingCheck` – If seller financing is part of the deal

**Appraisal**
- `AppraisalCheck` – Appraisal contingency
- `DaysForAppraisal` – Days to complete appraisal
- `DaysForAppraisalRightToCure` – Seller's right-to-cure window

**Home Sale**
- `HomeSaleContingencyCheck` – Buyer must sell current home first

**Well/Septic/Testing**
- `TestingContingencyCheck`, `TestingContingencyDays`, `TestingContingencyTests2` – General property testing
- `SepticContingencyCheck`, `SepticContingencyDays` – Septic inspection contingency

---

## 📬 Templated Emails

HTML-based email summaries of offers, using:
- `OfferSummaryEmailTemplate.js`
- `BuyerTransactionEmailTemplate.js`

Email includes:
- Buyer/seller names
- Offer price and earnest money
- Key contingency status
- Deadlines and custom remarks

---

## 🧠 Utility Modules

- `textSplitter.js` – Wraps long fields into multiple PDF boxes
- `splitAndAllocateProvisions.js` – Early logic for handling overflow
- `coordinateUtils.js` – Placeholder for dynamic Y-axis logic
- `offerCalculations.js` – Simple backend math utilities
- `number-to-words` – Converts price to uppercase text

---

## 📦 Tech Stack

- **Node.js**
- **Express**
- **MongoDB (Mongoose)**
- **pdf-lib**
- **nodemailer**
- **number-to-words**

---

## 🗂 File Structure

backend/
├── routes/
│ └── templates.js # Core contract logic
├── config/
│ ├── fieldConfig.js # PDF field mappings
│ └── addendumAfieldconfig.js # Addendum config (WIP)
├── util/
│ ├── textSplitter.js
│ ├── coordinateUtils.js
│ ├── offerCalculations.js
│ ├── splitAndAllocateProvisions.js
│ ├── OfferSummaryEmailTemplate.js
│ ├── BuyerTransactionEmailTemplate.js
│ └── nodemailertest.js
├── server.js # App entry
├── backendTest.js # Dev harness

---

## 🗺 Roadmap
Overflow-safe field splitting and multi-page addenda

Signature block injection

Multiple contract templates

Cloud uploads (S3/GCS)

Admin UI for reviewing and generating contracts

## 🙋‍♂️ Why It Exists
This was built to solve a real bottleneck: generating contracts from scratch every time. The system mimics how agents actually work — with data scattered across platforms and deadlines everywhere. This backend puts it all in one place, and builds the paperwork for you.

👤 Author
Kurtis Stuckert
Builder, systems guy, ex-broker. Built this for a real business — not for show.

👤 Author Kurtis Stuckert Builder, systems and operations, ex-broker. Built this for a real business — not for show.

