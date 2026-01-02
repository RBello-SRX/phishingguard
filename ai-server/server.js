import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "No email data provided" });
    }

    const prompt = `
You are a cybersecurity email analysis engine.

Analyze the following email and respond STRICTLY in JSON with this structure:

{
  "verdict": "Safe | Suspicious | Malicious",
  "score": number (0–100 risk score),
  "highlights": string[],
  "explanation": string
}

Email data:
${JSON.stringify(email, null, 2)}
`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt,
        stream: false
      })
    });

    const data = await response.json();

    let parsed;
    try {
      parsed = JSON.parse(data.response);
    } catch {
      return res.status(500).json({
        error: "AI response not valid JSON",
        raw: data.response
      });
    }

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

app.listen(5000, () => {
  console.log("🧠 Local AI server running on http://localhost:5000");
});
