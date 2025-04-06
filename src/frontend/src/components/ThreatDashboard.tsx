import React, { useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// import './ThreatDashboard.css';

// Define the Threat type
type Threat = {
    name: string;
    vulnerability: string;
    risk_score: number;
};

const ThreatDashboard: React.FC = () => {
    // Sample threat data
    const threats: Threat[] = [
        { name: 'DDoS', vulnerability: 'Unprotected endpoints', risk_score: 8 },
        { name: 'SQL Injection', vulnerability: 'Weak input validation', risk_score: 9 },
        { name: 'Brute Force', vulnerability: 'Weak passwords', risk_score: 7 },
    ];

    var ctx = (document.getElementById('riskChart') as HTMLCanvasElement).getContext('2d');

    useEffect(() => {
        if (ctx) {
            var riskChart = new ChartJS(ctx, {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                        label: 'Risk Score Trend',
                        data: [10, 25, 35, 50],
                        borderColor: 'red',
                        fill: false
                    }]
                }
            });
            const config = {
                type: 'line',
                data: riskChart,
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Chart.js Line Chart'
                        }
                    }
                },
            }
            // Cleanup chart on component unmount
            return () => {
                riskChart.destroy();
            };
        }
    }, []);
    
    return (
        <div className="ThreatDashboard">
            <header className="ThreatDashboard-header">
                <h1>Real-Time Threat Intelligence</h1>
                <p>Live Threat Updates will be displayed here.</p>
                <h2>Threat Intelligence Overview</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Threat</th>
                            <th>Vulnerability</th>
                            <th>Risk Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {threats.map((threat, index) => (
                            <tr key={index}>
                                <td>{threat.name}</td>
                                <td>{threat.vulnerability}</td>
                                <td>{threat.risk_score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <line>
                        data={riskChart};
                        options={config};
                    </line>
                </div>
                <p>
                    Edit <code>src/ThreatDashboard.tsx</code> and save to reload.
                </p>
                <a
                    className="ThreatDashboard-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
};

export default ThreatDashboard;
