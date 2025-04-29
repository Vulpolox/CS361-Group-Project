# Threat Intelligence Platform

This project provides a web-based threat intelligence platform with a React frontend and a Node.js/Express backend using SQLite.

## Project Structure

```
/
├── backend/              # Node.js/Express backend
│   ├── src/              # Source code
│   ├── node_modules/     # (ignored) Backend dependencies
│   ├── package.json      # Backend dependencies and scripts
│   ├── srv.env           # (ignored) Environment variables (API keys, ports, etc.)
│   └── threat_intel.db   # (ignored) SQLite database file
├── frontend/             # React/Vite frontend
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   ├── node_modules/     # (ignored) Frontend dependencies
│   ├── package.json      # Frontend dependencies and scripts
│   └── ...               # Other frontend config files (vite, tsconfig, etc.)
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## Setup and Running

### Prerequisites

- Node.js (v18 or later recommended)
- npm (usually comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Backend Environment Variables:**

    - Navigate to the `backend/` directory.
    - Create a file named `srv.env` by copying the example or based on required variables. At a minimum, you might need:

      ```env
      # Ports (Defaults are 5050 for backend, 5173 for frontend)
      PORT=5050
      FRONTEND_URL=http://localhost:5173

      # Add other necessary API keys or configurations
      # OPENAI_API_KEY=your_openai_key
      # SHODAN_API_KEY=your_shodan_key
      # ... etc
      ```

    - **Important:** The `backend/srv.env` file is ignored by git. Make sure you create it in your local environment.

### Running the Application

1.  **Start the Backend Server:**

    - Open a terminal in the `backend/` directory.
    - Run:
      ```bash
      npm run dev
      ```
    - This typically starts the server on `http://localhost:5050` (or the port specified in `srv.env`).

2.  **Start the Frontend Development Server:**
    - Open _another_ terminal in the `frontend/` directory.
    - Run:
      ```bash
      npm run dev
      ```
    - This typically opens the application in your browser at `http://localhost:5173` (or the next available port).

The frontend will connect to the backend API running on port 5050.

##Weekly Updates:

**Week 1: Team Formation, Project Planning, and Initial Research**
Files:
team_structure.md - Jack Keys
tech_stack.md - Jack Keys
nist_framework_summary.md - Samuel Yohannes 
osint_research.md - Samuel Yohannes

**Week 2: Setting Up the Web Application & OSINT Research**
Files:
schema.sql - Toan Nguyen
api_research.md - Haley Nilsen
threatdashboard.tsx - Montana Nicholson

**Week 3: Asset Identification & TVA Mapping**
Files:
assets.sql - Toan Nguyen
tva_mapping.sql - Toan Nguyen
fetch_osint.js - Samuel Yohannes
risk_analysis.js - Samuel Yohannes

**Week 4: Real-Time Threat Integration** 
Files:
shodan_integration.js - Samuel Yohannes
api_scheduler.js - Samuel Yohannes
ThreatDashboard.tsx - Montana Nicholson
alerts.js - Samuel Yohannes
api_tests.js - Samuel Yohannes

**Week 5: Risk Analysis, Automated Risk Scoring. and Threat Mitigation Planning**
Files:
risk_analysis.js - Samuel Yohannes
tva_update.sql - Toan Nguyen
risk_prioritization.js - Samuel Yohannes
mitigation_recommendations.js - Samuel Yohannes
incident_response.js - Samuel Yohannes

**Week 6: Real-Time Risk Alerts, Incident Response, and Cost-Benefit Analysis for Risk Treatment**
Files:
alerts.js - Samuel Yohannes
incident_response.js - Samuel Yohannes
cba_analysis.js - Samuel Yohannes
ThreatDashboard.tsx - Montana Nicholson
api_optimizer.js - Samuel Yohannes

**Week 7: Fine-Tuning Risk Scoring, Threat Report Generation, and Security Audits**
Files:
risk_scoring.js - Samuel Yohannes
security_audit.md - Samuel Yohannes 

**Week 8: Advanced Blue Teaming Features, AI-Powered Threat Hunting, and System Documentation**
Files:
blue_team_defense.js - Samuel Yohannes
ai_threat_hunting.js - Samuel Yohannes
threat_mitigation.js - Samuel Yohannes
system_manual.js - Montana Nicholson
user_guide.md - Montana Nicholson
api_documentation.yaml - Samuel Yohannes

**Week 9: Final System Testing, Security Validation, and Performance Optimization**
Files:
security_validation.md - Haley Nilsen
performance_testing.md - Haley Nilsen
query_optimizations.md - Haley Nilsen
deployment_checklist.md - Haley Nilsen
troubleshooting_guide.md - Haley Nilsen

**Week 10: Final Report Submission, System Demonstration, and Presentation Preperation**
--This week includes a rework of the previous files. Previous files are located in /legacy-files, and the new code can be found in /backend and /frontend
Files:
/backend - Jack Keys
/frontend - Jack Keys
/legacy-files - Jack Keys
final_project_report.md - Haley Nilsen
final_presentation.pptx - Haley Nilsen
system_walkthrough.md - Haley Nilsen
