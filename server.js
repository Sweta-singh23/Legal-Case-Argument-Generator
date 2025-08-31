const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 👉 Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// If user visits root "/", serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Connect Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate", async (req, res) => {
  try {
    const { caseText, side } = req.body;

    if (!caseText || !side) {
      return res.status(400).json({ error: "Missing case facts or side." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a legal coach preparing a lawyer for court. Only generate content from the perspective of the lawyer I am coaching. Use simple, clear language that a non-lawyer can understand. Do NOT give generic instructions or placeholders.

Case facts: ${caseText}
Side: ${side}

For each argument, include:

1. Core argument (simple language)
2. Relevant law or statute (give specific examples if possible)
3. Key supporting evidence (short bullet points)
4. Anticipated cross-examination questions with suggested responses

Format the output strictly as a prep sheet with bullet points. 
Do NOT include next-step instructions or placeholders.
`;

    const result = await model.generateContent(prompt);

    res.json({ output: result.text || result.response?.text() || "" });

  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Error generating arguments" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
