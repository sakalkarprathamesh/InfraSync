# INFRASYNC — AI-Powered Urban Road Excavation Coordination System

> **“Coordinate infrastructure work before the road is dug.”**

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.9%2B-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.1-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan.svg)
![Tests](https://img.shields.io/badge/Tests-13%20Passed-emerald.svg)

---

## 1. Project Information
- **Full Title**: AI-Powered Urban Road Excavation Coordination System
- **Institution**: MIT School of Computing
- **Department**: Department of Computer Science & Engineering
- **Faculty Guide**: Dr. Tejaswani Bhosale
- **Class / Group ID**: SY904
- **Student Development Team**:
  - Prathamesh
  - Chaitanya
  - Sharvari
  - Shravani
- **Category**: Smart Cities, Urban Infrastructure Management, GIS & Intelligent Scheduling

---

## 2. Key Capabilities
1. **Centralized Right-of-Way Registry**: Multi-department tracking of proposed, approved, and active road excavation activities.
2. **Deterministic Conflict Detection Engine**: Geospatial proximity analysis ($<150$m Haversine matrix), interval overlap detection, and 14-day sequential excavation prevention.
3. **Explainable Joint Scheduling**: Rule-based candidate window generation with feasibility ratings (0–100%) and duplicate asphalt restoration cost saving models.
4. **Interactive GIS Map**: OpenStreetMap Leaflet visualization calibrated with 10 verified corridors in Pune, Maharashtra.
5. **Decoupled Road Restoration Tracking**: Strict state machine separating civil excavation completion from municipal asphalt certification.
6. **Inter-Agency Collaboration**: Threaded discussions, official coordination action notes, and shared equipment pooling.
7. **Role-Based Access Control**: Secure JWT authentication with 1-click persona switching for jury demonstration.

---

## 3. Technology Stack

### Frontend
- **React 18** with **TypeScript** and **Vite**
- **Tailwind CSS** with civic color tokens
- **Leaflet & OpenStreetMap** for interactive GIS maps
- **Recharts** for executive charts and quantitative analytics
- **Lucide React** for infrastructure icons

### Backend
- **Python 3.9+** with **FastAPI**
- **SQLAlchemy 2.0 ORM** & **Pydantic v2**
- **Pytest** for automated test suites
- **Passlib & BCrypt** for secure password hashing
- **Python-JOSE** for JWT authentication

### Database
- **SQLite** default for zero-configuration local runs (`sqlite:///./infrasync.db`)
- **PostgreSQL / PostGIS** compatible via `DATABASE_URL` environment variable

---

## 4. Quick Startup Instructions

### 4.1 Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Start the FastAPI server:
   ```bash
   python run.py
   ```
   *The server starts at `http://127.0.0.1:8000`. Swagger API documentation is available at `http://127.0.0.1:8000/docs`.*

### 4.2 Frontend Setup
1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Open your browser at `http://localhost:5173`.*

---

## 5. Demonstration Accounts

Infrasync includes a **One-Click Demo Switcher** directly in the top navigation bar. You can also sign in manually using:

| Persona | Role | Email | Password | Organization |
| :--- | :--- | :--- | :--- | :--- |
| **Dr. Sanjeev Joshi** | Municipal Admin | `admin@infrasync.gov.in` | `Admin@123` | Pune Municipal Corporation |
| **Er. Ramesh Deshmukh** | Department User | `water@infrasync.gov.in` | `Water@123` | PMC Water Supply Dept |
| **Er. Sandeep Kulkarni** | Department User | `power@infrasync.gov.in` | `Power@123` | MSEDCL Electricity |
| **Rajesh Sharma** | Department User | `gas@infrasync.gov.in` | `Gas@123` | MNGL Natural Gas |
| **Pooja Mehta** | Department User | `telecom@infrasync.gov.in` | `Telecom@123` | Telecom & OFC Infrastructure |
| **Siddharth Patwardhan** | Public Viewer | `viewer@infrasync.gov.in` | `Viewer@123` | Citizen Forum Observer |

---

## 6. Running Automated Tests
Run the 13 automated test cases covering collision algorithms, interval comparisons, and lifecycle state transitions:
```bash
PYTHONPATH=backend backend/venv/bin/pytest backend/tests/ -v
```

---

## 7. Project Documentation Index
- [System Architecture & Dataflow](docs/ARCHITECTURE.md)
- [Entity Relationship Diagram (ERD)](docs/ERD.md)
- [Use-Case Model & User Journeys](docs/USE_CASES.md)
- [Design Thinking Framework (5 Stages)](docs/DESIGN_THINKING.md)
- [Working Prototype vs. Future Scope Matrix](docs/SCOPE_MATRIX.md)
- [College Presentation & Demonstration Script](docs/DEMO_SCRIPT.md)
