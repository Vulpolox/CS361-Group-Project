import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

type Threat = {
    name: string;
    vulnerability: string;
    risk_score: number;
};

const ThreatDashboard: React.FC = () => {
    const [threats, setThreats] = useState<Threat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThreats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/threats');
                console.log('Fetched threats:', response.data);
                setThreats(response.data);
            } catch (error) {
                console.error('Error fetching threat data:', error);
                setError("Failed to load threat data.");
            } finally {
                setLoading(false);
            }
        };

        fetchThreats();
    }, []);

    useEffect(() => {
        const ctx = (document.getElementById('riskChart') as HTMLCanvasElement)?.getContext('2d');
        if (ctx && threats.length > 0) {
            const riskChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: threats.map((_, i) => `Threat ${i + 1}`),
                    datasets: [
                        {
                            label: 'Risk Score Trend',
                            data: threats.map((t) => t.risk_score),
                            borderColor: 'red',
                            backgroundColor: 'rgba(255,0,0,0.1)',
                            fill: true,
                            tension: 0.3
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Threats',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Risk Score',
                            },
                            min: 0,
                            max: 100
                        },
                    },
                },
            });

            return () => {
                riskChart.destroy();
            };
        }
    }, [threats]);

    return (
        <div className="ThreatDashboard" style={{ padding: "2rem" }}>
            <header className="ThreatDashboard-header">
                <h1>🔐 Real-Time Threat Intelligence</h1>
                <h2>Threat Intelligence Overview</h2>

                {loading && <p>Loading threat data...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {!loading && threats.length > 0 && (
                    <>
                        <table border={1} cellPadding={8} style={{ width: "100%", marginBottom: "2rem" }}>
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

                        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                            <canvas id="riskChart" />
                        </div>
                    </>
                )}
            </header>
        </div>
    );
};

export default ThreatDashboard;
