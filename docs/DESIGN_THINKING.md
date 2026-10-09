# Infrasync — Design Thinking Framework

## Executive Summary
This document outlines the systematic application of the five stages of Design Thinking to address the systemic urban problem of repeated road excavations across Indian metropolitan cities (specifically modeled for Pune Municipal Corporation).

---

## Stage 1: Empathize
### Stakeholder Research & Pain Points
To understand why newly constructed roads are repeatedly excavated, we analyzed the workflow of five key municipal stakeholders:
1. **Water Supply Department (PMC)**: High urgency during pipeline bursts; limited awareness of electrical conduits below road surface.
2. **Electricity Distribution (MSEDCL)**: Needs rapid cable fault isolation; digging without prior municipal notification risks bursting adjacent water mains.
3. **Natural Gas Agency (MNGL)**: Requires safe trenching clearances away from electrical sparking hazards.
4. **Telecommunications Companies**: Micro-trenching optical fibers often cuts through previously laid stormwater ducts.
5. **Municipal Road Engineering Cell**: Bears public backlash and duplicate budgetary expenses for recurring asphalt reconstruction.

### Key Insights:
- Departments operate in isolated organizational silos.
- Right-of-way permissions are handled via slow paper files.
- No unified spatial map displays other departments' planned works.

---

## Stage 2: Define
### Problem Statement
> *"Urban departments and utility agencies frequently plan road excavations independently. This results in repeated excavation, duplicated road restoration expenses, chronic traffic congestion, public hazards, and inefficient infrastructure planning. A centralized decision-support platform is needed to provide spatial visibility, detect overlapping works, and coordinate excavation schedules before roads are dug."*

---

## Stage 3: Ideate
### Solution Concepts Generated
- **Centralized Registry**: A single database storing all intended right-of-way excavations.
- **Deterministic Collision Detection**: Combining geospatial proximity (Haversine formula, $<150$m threshold) with temporal interval comparisons.
- **Sequential Re-Excavation Prevention**: Flagging independent works planned within 14 days on the same road to prevent paving a road only to dig it up two weeks later.
- **Explainable Joint Scheduling**: Generating candidate shared work windows with transparent feasibility scoring and civic cost-saving projections.
- **Independent Restoration Tracking**: Decoupling civil excavation completion from municipal asphalt certification.

---

## Stage 4: Prototype
### Architecture & Implementation
We built a responsive full-stack prototype:
- **Backend**: Python FastAPI with SQLite / PostgreSQL persistence and Pytest validation.
- **Frontend**: React 18, TypeScript, Tailwind CSS, Leaflet OpenStreetMap GIS, and Recharts analytics.
- **Demonstration Dataset**: 18 realistic demonstration projects across 10 major Pune corridors (Central Avenue, FC Road, Karve Road, Baner Road, Aundh, Senapati Bapat Road).

---

## Stage 5: Test
### Verification & Findings
- **Automated Logic Testing**: 13 automated Pytest test cases covering exact spatial overlap, sequential windows, and emergency overrides.
- **End-to-End Persona Validation**: Tested role transitions across Municipal Admin, Water Department, Power Department, and Public Observer personas.
- **Known Limitations & Fallbacks**: Documented in the project scope matrix (e.g. simulated live GPS telemetry and manual traffic sensor inputs).
