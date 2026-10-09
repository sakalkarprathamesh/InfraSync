# Infrasync — Scope & Implementation Matrix

To maintain rigorous engineering integrity, this matrix distinguishes **fully implemented and verified prototype functionality** from **simulated integrations** and **future research scope**.

| Functional Domain | Implemented in Working Prototype | Simulated / Mocked Fallbacks | Future Scope (Post-PBL) |
| :--- | :--- | :--- | :--- |
| **Authentication & RBAC** | ✅ JWT Bearer token authentication, bcrypt password hashing, server-side role enforcement (`admin`, `department_user`, `viewer`). One-click demo persona switcher. | — | Multi-factor hardware security keys (FIDO2/WebAuthn), Aadhaar e-Sign SSO. |
| **Excavation Request Lifecycle** | ✅ Full CRUD, unique `REQ-YYYY-NNN` generation, date validation, coordinate boundary validation, full audit trail. | — | Municipal fee payment gateway for private telecom contractors. |
| **Conflict Detection Engine** | ✅ Deterministic Haversine great-circle distance algorithm, date interval overlap, 14-day sequential excavation prevention, and emergency override rules. | — | Machine learning model predicting unrecorded utility clashes from soil scans. |
| **Coordination & Scheduling** | ✅ Candidate window generation, rule-based compatibility scoring (0–100), estimated restoration cost savings model, department voting, and admin confirmation. | — | Mathematical linear programming (MILP) with city-wide traffic equilibrium models. |
| **GIS Mapping** | ✅ Leaflet.js with OpenStreetMap tiles, verified Pune road corridors, department-colored pins, interactive popups, and layer filtering. | Demonstration coordinates mapped to Pune corridors (FC Road, Karve Road, etc.). | Live GNSS excavator telemetry and high-resolution satellite imagery. |
| **Road Restoration** | ✅ Distinct entity decoupling excavation completion from restoration certification. Inspection verification workflow with quality ratings. | Laboratory core asphalt density test reports simulated as text records. | Computer vision pothole and asphalt unevenness detection from municipal patrol cameras. |
| **In-App Notifications** | ✅ Event-driven notification center with read/unread tracking and direct links to affected records. | External SMS and SMTP email delivery (disabled locally to avoid external carrier dependencies). | Push notifications via WhatsApp Business API and municipal civic mobile apps. |
| **Department Collaboration** | ✅ Project-linked threaded discussions, coordination action notes with sender metadata. | — | Real-time video coordination meeting rooms (WebRTC). |
| **Resource Sharing** | ✅ Resource registry for heavy excavators, sludge dewatering pumps, and GPR radar locators. | — | Automated physical machinery dispatch and GPS telematics tracking. |
