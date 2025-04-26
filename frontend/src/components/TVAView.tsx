import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND = "http://localhost:5050";

type TVA = {
  threat: string;
  vulnerability: string;
  asset: string;
  asset_id: string;
  threat_name: string;
  vulnerability_description: string;
  likelihood: string;
  impact: string;
};

const TVAView: React.FC = () => {
  const [tvaData, setTvaData] = useState<TVA[]>([]);

  useEffect(() => {
    axios.get(`${BACKEND}/api/tva`).then((res) => setTvaData(res.data));
  }, []);

  return (
    <div>
      <h2>📊 TVA Mapping</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Threat</th>
            <th>Vulnerability</th>
            <th>Impact</th>
            <th>Likelihood</th>
          </tr>
        </thead>
        <tbody>
          {tvaData.map((item, index) => (
            <tr key={index}>
              <td>{item.asset}</td>
              <td>{item.threat}</td>
              <td>{item.vulnerability}</td>
              <td>{item.impact}</td>
              <td>{item.likelihood}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TVAView;
