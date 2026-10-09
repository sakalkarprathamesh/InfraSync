# Infrasync — Entity Relationship Diagram (ERD)

## 1. Relational Schema Architecture

```mermaid
erDiagram
    DEPARTMENTS ||--o{ USERS : "employs"
    DEPARTMENTS ||--o{ EXCAVATION_REQUESTS : "sponsors"
    DEPARTMENTS ||--o{ SHARED_RESOURCES : "pools"
    USERS ||--o{ EXCAVATION_REQUESTS : "submits"
    USERS ||--o{ STATUS_HISTORY : "records"
    USERS ||--o{ PROJECT_DISCUSSIONS : "authors"
    USERS ||--o{ RESTORATION_RECORDS : "verifies"
    ROADS ||--o{ EXCAVATION_REQUESTS : "locates"

    EXCAVATION_REQUESTS ||--o{ CONFLICT_MATCHES : "primary in"
    EXCAVATION_REQUESTS ||--o{ STATUS_HISTORY : "logs"
    EXCAVATION_REQUESTS ||--o| RESTORATION_RECORDS : "certified by"
    EXCAVATION_REQUESTS ||--o{ SCHEDULES : "scheduled by"
    EXCAVATION_REQUESTS ||--o{ PROJECT_DISCUSSIONS : "contains"

    COORDINATION_PROPOSALS ||--o{ COORDINATION_DECISIONS : "voted upon"
    COORDINATION_PROPOSALS ||--o{ SCHEDULES : "confirms"
    COORDINATION_PROPOSALS ||--o{ PROJECT_DISCUSSIONS : "threads"

    DEPARTMENTS {
        int id PK
        string name
        string code
        string contact_person
        string phone
        string email
        string color
    }

    USERS {
        int id PK
        string name
        string email
        string hashed_password
        string role
        int department_id FK
    }

    ROADS {
        int id PK
        string name
        string road_code
        string locality
        string ward
        float length_km
        float latitude
        float longitude
    }

    EXCAVATION_REQUESTS {
        int id PK
        string request_code
        string title
        int department_id FK
        int road_id FK
        string work_type
        date proposed_start_date
        int expected_duration_days
        date proposed_end_date
        float excavation_length_meters
        float excavation_depth_meters
        string priority
        string status
        float estimated_cost
        int created_by_user_id FK
    }

    CONFLICT_MATCHES {
        int id PK
        int request_a_id FK
        int request_b_id FK
        string conflict_category
        string severity
        float distance_meters
        int days_difference
        string matching_rule
        string explanation
        string recommended_action
        string status
    }

    COORDINATION_PROPOSALS {
        int id PK
        string proposal_code
        string title
        int primary_request_id FK
        int secondary_request_id FK
        int lead_department_id FK
        date proposed_start_date
        date proposed_end_date
        int combined_duration_days
        float feasibility_score
        float estimated_savings_inr
        string status
    }

    SCHEDULES {
        int id PK
        string schedule_code
        int request_id FK
        int coordination_proposal_id FK
        date confirmed_start_date
        date confirmed_end_date
        string status
        string traffic_advisory
        int confirmed_by_admin_id FK
    }

    RESTORATION_RECORDS {
        int id PK
        int request_id FK
        date completion_date
        string contractor_name
        string road_surface_restored
        int restoration_quality_rating
        date inspection_date
        string inspector_name
        string verification_status
        int verified_by_user_id FK
    }
```

## 2. Integrity & Constraints
1. **Request Uniqueness**: `request_code` follows the immutable format `REQ-YYYY-NNN`.
2. **Deterministic Distance Threshold**: Geographic coordinates are indexed and verified against Pune city bounding boxes ($18.4^\circ\text{N} - 18.6^\circ\text{N}$, $73.7^\circ\text{E} - 74.0^\circ\text{E}$).
3. **Decoupled Lifecycle**: Road restoration is recorded in `RESTORATION_RECORDS`, preventing a completed excavation from automatically pretending the road surface has been restored.
