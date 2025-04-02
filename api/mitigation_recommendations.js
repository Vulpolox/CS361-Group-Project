// Automated Risk Mitigation
function recommendMitigation(threat) {
    const mitigationStrategies = {
        'SQL Injection': 'Use parameterized queries and input validation.',
        'DDoS Attack': 'Implement rate limiting and cloud-based mitigation services.',
        'Open Ports': 'Close unused ports and implement firewall rules.',
    };
    return mitigationStrategies[threat] || 'No specific mitigation available.';
}
