import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND = "http://localhost:5050";

type Alert = {
  id: number;
  message: string;
  level: string;
  created_at: string;
};

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    axios.get(`${BACKEND}/api/alerts`).then((res) => setAlerts(res.data));
  }, []);

  return (
    <div>
      <h2>📢 Alerts</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Level</th>
            <th>Message</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((a) => (
            <tr key={a.id}>
              <td>{a.level}</td>
              <td>{a.message}</td>
              <td>{a.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsPage;
