const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();
router.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY is not defined in the environment variables.");
    process.exit(1); // Exit the application if the API key is missing
}

router.post("/chat", async (req, res) => {
    try {
        const { question } = req.body;
        console.log("Received question:", question);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: question }] }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Gemini AI Response:", JSON.stringify(data, null, 2));

        // Extract and format AI response
        if (data?.candidates?.length > 0) {
            let aiResponse = data.candidates[0]?.content?.parts
                ?.map(part => part.text.replace(/^(\*\*)/gm, "").trim()) // Remove leading "**"
                .join("\n\n") || "No response generated.";
            
            res.json({ answer: aiResponse });
        } else {
            res.status(500).json({ error: "Invalid response format from Gemini AI" });
        }
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        res.status(500).json({ error: "Error processing request" });
    }
});

module.exports = router;
