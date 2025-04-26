import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ThreatDashboard from "./ThreatDashboard";
import AlertsPage from "./AlertsPage";
import TVAView from "./TVAView";


const App: React.FC = () => {
  return (
    <Router>
      <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
        <nav style={{ marginBottom: '1rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Dashboard</Link>
          <Link to="/alerts" style={{ marginRight: '1rem' }}>Alerts</Link>
          <Link to="/tva">TVA Mapping</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ThreatDashboard />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/tva" element={<TVAView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

