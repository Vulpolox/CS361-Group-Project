

/**
 * Calculates the Cost-Benefit Analysis (CBA) result.
 * 
 * Formula:
 * CBA = ALE_prior - ALE_post - ACS
 * 
 * @param {number} alePrior - Annual Loss Expectancy before mitigation
 * @param {number} alePost - Annual Loss Expectancy after mitigation
 * @param {number} acs - Annual Cost of Security
 * @returns {number} - The CBA result
 */
function calculateCBA(alePrior, alePost, acs) {
    return alePrior - alePost - acs;
}

// Example usage
const alePrior = 50000; // $50,000 expected loss before mitigation
const alePost = 10000;  // $10,000 expected loss after mitigation
const acs = 15000;      // $15,000 annual cost of control

const cbaResult = calculateCBA(alePrior, alePost, acs);
console.log(`Cost-Benefit Analysis Result: $${cbaResult}`);
