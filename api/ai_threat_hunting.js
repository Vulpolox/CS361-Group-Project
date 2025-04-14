const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

/**
 * Predicts potential next steps based on a security threat description using GPT-4.
 * @param {string} threatDescription - The description of the detected threat.
 */
async function predictThreatBehavior(threatDescription) {
    if (!threatDescription || typeof threatDescription !== "string") {
        console.error("⚠️ A valid threat description must be provided.");
        return;
    }

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const prompt = `You are a cybersecurity expert. Analyze this security threat and predict the most likely next attack vectors or steps:\n\n"${threatDescription}"`;

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert in cybersecurity threat analysis." },
                { role: "user", content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        const result = response.data.choices[0].message.content.trim();
        console.log("🧠 Predicted Next Steps:\n", result);
        return result;
    } catch (err) {
        console.error("❌ Error during AI prediction:", err.response?.data || err.message);
    }
}

// Example usage
predictThreatBehavior("SQL Injection detected on login page.");

// Install the OpenAI package: npm install openai dotenv
// set up .env file in the root of the project : OPENAI_API_KEY=your_actual_api_key_here

