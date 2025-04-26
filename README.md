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
