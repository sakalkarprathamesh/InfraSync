# Infrasync — College Presentation & Demonstration Script

**Project Title**: INFRASYNC — AI-Powered Urban Road Excavation Coordination System  
**Institution**: MIT School of Computing, Department of Computer Science & Engineering  
**Faculty Guide**: Dr. Tejaswani Bhosale  
**Class / Group ID**: SY904  
**Team Members**: Prathamesh, Chaitanya, Sharvari, Shravani  

---

## 1. Presentation Introduction (2 Minutes)

### Speaker 1 (Prathamesh):
> *"Respected Faculty Guide Dr. Tejaswani Bhosale and panel members. We present Infrasync — an AI-powered urban road excavation coordination system.*
> 
> *In rapidly growing cities like Pune, we frequently witness a frustrating civic problem: a newly paved asphalt road is reconstructed, and within days, another utility department digs it up again. Water, electricity, telecom, and gas agencies plan their works in organizational silos, resulting in repeated expenditure of public funds and massive citizen traffic disruption.*
> 
> *Our project tagline is: **'Coordinate infrastructure work before the road is dug.'** Infrasync provides a centralized, decision-support platform with real-time GIS mapping, deterministic conflict detection, explainable scheduling recommendations, and road restoration verification."*

---

## 2. Live Software Walkthrough (8 Minutes)

### Step 1: Login & Role Selection
- **Action**: Open the application at `http://localhost:5173`.
- **Narration (Chaitanya)**:
  > *"We begin at the Infrasync civic authentication portal. Notice our one-click demonstration persona switcher, allowing instant evaluation across roles: Municipal Administrator, Water Supply Officer, Power Engineer, Gas Manager, and Public Observer.*
  > *We will sign in as **Dr. Sanjeev Joshi**, the Municipal Administrator."*

### Step 2: Executive Overview Dashboard
- **Action**: Click on 'Municipal Admin' to land on the Overview dashboard.
- **Narration (Chaitanya)**:
  > *"The dashboard aggregates live metrics dynamically from the database: 15 total requests, active collisions, coordination opportunities, and estimated potential civic savings of over ₹2.4 Lakhs. Notice the featured evaluation scenario banner highlighted right on top."*

### Step 3: Inspecting the Required End-to-End Scenario
- **Action**: Navigate to **Excavation Requests** (`/requests`).
- **Narration (Sharvari)**:
  > *"Here is the central right-of-way registry. Look at our two primary demonstration projects on Central Avenue (FC Road), Shivaji Nagar:*
  > 1. **REQ-2026-001**: PMC Water Supply Department's 400mm feeder water pipeline repair (October 15 to 18). Status is **Approved**.
  > 2. **REQ-2026-002**: MSEDCL Electricity Distribution's 11kV underground power cable repair (October 17 to 20). Status is **Submitted**.
  > 
  > *Notice the red warning badge next to both requests indicating an active conflict."*

### Step 4: The Deterministic Conflict Detection Engine
- **Action**: Navigate to **Conflict Detection** (`/conflicts`).
- **Narration (Sharvari)**:
  > *"Under Conflict Detection, our engine evaluates both spatial proximity and temporal intervals deterministically. It has flagged `Direct Spatial & Temporal Overlap` between Request A and Request B under `RULE_SPATIAL_TEMPORAL_OVERLAP`.*
  > *The two trenches are located within 25 meters of each other with 2 days of overlapping digging. The engine warns that uncoordinated execution will block traffic twice and risk damaging adjacent utility lines."*

### Step 5: Explainable Coordination Recommendation
- **Action**: Click **'Coordinate Joint Schedule'** or open **Coordination Schedule** (`/coordination`).
- **Narration (Shravani)**:
  > *"Here is proposal **PROP-2026-001**. Rather than treating coordination as an opaque black box, our engine explains why joint execution is viable:*
  > - **Feasibility Score**: 85% based on staged vertical bedding (water pipeline at 2.2m depth laid below shallow power duct at 1.2m depth).
  > - **Recommended Shared Window**: October 15 to October 18 (4 consolidated days instead of two separate disruptions).
  > - **Estimated Civic Savings**: ₹38,400 in eliminated duplicate road milling and asphalt repaving charges."*

### Step 6: Department Voting & Administrative Confirmation
- **Action**: Click **'Submit Agency Decision'** to show Water and Power agencies voting 'Accept'. Then, as Municipal Admin, click **'Confirm Unified Schedule'**.
- **Narration (Shravani)**:
  > *"Both departments review the shared window. Now, as the Municipal Administrator, I confirm the unified schedule, enter the traffic diversion advisory, and submit.*
  > *Instantly, both projects advance to **Scheduled** status, audit trails are committed, and system notifications are dispatched."*

### Step 7: GIS Map & Restoration Verification
- **Action**: Navigate to **GIS Map** (`/map`), zoom in to Central Avenue, and click the marker. Then navigate to `/requests/REQ-2026-001`.
- **Narration (Prathamesh)**:
  > *"On the interactive Leaflet GIS map, each utility is visually color-coded according to municipal standards (Blue for Water, Amber for Electricity, Purple for Telecom).*
  > *Finally, Infrasync enforces a strict restoration lifecycle: a project is not complete when excavation ends; it enters **Restoration Pending** until the municipal road engineer performs laboratory density checks and certifies it as **Restoration Verified**."*

---

## 3. Conclusion & Evaluation Defense (2 Minutes)

### Speaker 1 (Prathamesh):
> *"Infrasync proves that intelligent decision-support and centralized GIS visibility can save municipal budgets, prolong pavement life, and minimize citizen traffic congestion. All 13 core business rules have been verified through automated Pytest suites. We thank our guide Dr. Tejaswani Bhosale for her valuable guidance and welcome any questions from the panel."*

---

## 4. Likely Jury Questions & Model Answers

### Q1: Does Infrasync automatically force departments to change their work dates?
**Answer**: No. Infrasync is a **decision-support platform**, not an automated dictator. It calculates feasibility scores and candidate windows. Department heads review constraints (e.g. power shut-down hours) and vote on proposals. The Municipal Administrator makes the final binding right-of-way decision.

### Q2: How does the conflict engine prevent false positives for projects on the same road?
**Answer**: Roads in Pune can span several kilometers. Infrasync evaluates the Haversine great-circle distance between exact project coordinates ($<150$m threshold) in addition to road identifiers. If two works are on the same road but 2 kilometers apart, they are not flagged as a trench collision.

### Q3: What database and GIS technology is used?
**Answer**: The backend uses Python FastAPI with SQLAlchemy ORM. The relational model is fully compatible with PostgreSQL and PostGIS, using Haversine trigonometric functions as a zero-dependency fallback for local demonstration. The frontend utilizes Leaflet and OpenStreetMap.
