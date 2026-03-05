const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const HISTORY_FILE = path.join(__dirname, '../data/chat_history.json');

// Helper to read history
const readHistory = () => {
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            const data = fs.readFileSync(HISTORY_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (err) {
        console.error("Error reading history:", err);
        return [];
    }
};

// Helper to save history
const saveHistory = (historyData) => {
    try {
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyData, null, 2));
    } catch (err) {
        console.error("Error saving history:", err);
    }
};

exports.handleChat = async (req, res) => {
    const { message, sessionId } = req.body;
    const userId = req.user ? req.user.id : 'guest_user';

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    let allSessions = readHistory();
    let currentSession;
    let isNewSession = false;

    // Find or Create Session
    if (sessionId) {
        currentSession = allSessions.find(s => s.sessionId === sessionId);
    }

    if (!currentSession) {
        isNewSession = true;
        currentSession = {
            sessionId: sessionId || crypto.randomUUID(),
            userId,
            title: "New Chat",
            messages: []
        };
        allSessions.push(currentSession);
    }

    // Prepare context
    const contextMessages = currentSession.messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
    }));

    try {
        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a professional AI Travel Assistant dedicated EXCLUSIVELY to Indian travel.

Your role is to promote and assist with travel WITHIN INDIA only.

Rules:
1. If a user asks about destinations outside India (e.g., Paris, New York, Bali), politely decline and redirect them to Indian alternatives (e.g., "I specialize only in Indian travel. For a similar experience, consider Pondicherry or Goa!").
2. Suggest 2–4 Indian destinations with short explanations when asked for recommendations.
3. If the user requests a travel plan or itinerary:
   - Generate a clear, day-wise itinerary.
   - For each day, include: Activities, Places to visit, and Travel tips.
   - Example format: "Day 1: Arrival + Sightseeing..."
4. When asked to compare places, provide a concise comparison of their pros and cons.
5. Provide a full, helpful answer immediately. Do NOT ask follow-up questions or for budget/days unless strictly necessary for a calculation.
6. Tone: Welcoming ("Namaste!"), knowledgeable, and enthusiastic about India.

Data Categories:
- Beaches: Goa, Andaman, Kerala, Gokarna, Varkala, Pondicherry.
- Mountains: Manali, Shimla, Leh-Ladakh, Ooty, Darjeeling, Munnar, Kashmir.
- Heritage: Jaipur, Udaipur, Agra, Varanasi, Hampi, Khajuraho.
- Nature: Kerala (Alleppey), Coorg, Sikkim, Meghalaya, Rishikesh.
- Spiritual: Kedarnath, Badrinath, Tirupati, Vaishno Devi, Amritsar.

CRITICAL FORMATTING INSTRUCTION:
You MUST return your response in the following JSON format ONLY. Do not include any text outside the JSON object.
{
  "response": "Your natural language answer here (Markdown supported)",
  "suggestions": [] // MUST be an empty array unless suggested destinations are relevant.
}`
                },
                ...contextMessages,
                { role: "user", content: message }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 1024,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        let parsedContent;
        try {
            parsedContent = JSON.parse(content);
        } catch (e) {
            parsedContent = {
                response: content || "Error parsing response.",
                suggestions: ["Try again"]
            };
        }

        // Generate Title for new sessions (using a separate lightweight call or heuristic?)
        // For simplicity, we'll just set it to the first user message if it's "New Chat"
        if (currentSession.title === "New Chat") {
            // Simple heuristic: First 30 chars of message
            currentSession.title = message.length > 30 ? message.substring(0, 30) + "..." : message;
        }

        // Update History
        const newMessages = [
            { role: "user", content: message, timestamp: new Date().toISOString() },
            {
                role: "assistant",
                content: parsedContent.response,
                suggestions: parsedContent.suggestions,
                timestamp: new Date().toISOString()
            }
        ];

        currentSession.messages.push(...newMessages);
        saveHistory(allSessions);

        res.json({
            ...parsedContent,
            sessionId: currentSession.sessionId,
            title: currentSession.title
        });

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({ error: 'Failed to fetch AI response' });
    }
};

exports.getSessions = (req, res) => {
    const userId = req.user.id;
    const allSessions = readHistory();
    // Filter by user and return summary only
    const userSessions = allSessions
        .filter(s => s.userId === userId)
        .map(s => ({
            sessionId: s.sessionId,
            title: s.title,
            lastMessage: s.messages[s.messages.length - 1]?.content || "",
            timestamp: s.messages[s.messages.length - 1]?.timestamp
        }))
        .reverse(); // Newest first

    res.json(userSessions);
};

exports.getSessionHistory = (req, res) => {
    const { sessionId } = req.query;
    const allSessions = readHistory();
    const session = allSessions.find(s => s.sessionId === sessionId && s.userId === req.user.id);

    res.json(session ? session.messages : []);
};

// --- Voice AI Integration ---

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temp storage

exports.uploadMiddleware = upload.single('audio');

exports.transcribeAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file uploaded' });
        }

        const originalPath = req.file.path;
        const newPath = `${originalPath}.webm`;

        // Rename file to include extension (Groq requires this for file type detection)
        fs.renameSync(originalPath, newPath);

        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(newPath),
            model: "whisper-large-v3",
            response_format: "json",
            temperature: 0.0
        });

        // Cleanup temp file
        if (fs.existsSync(newPath)) fs.unlinkSync(newPath);

        res.json({ text: transcription.text });

    } catch (error) {
        console.error("Transcription Error Full Details:", JSON.stringify(error, null, 2));

        // Cleanup temp files
        const originalPath = req.file?.path;
        if (originalPath && fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
        if (originalPath && fs.existsSync(`${originalPath}.webm`)) fs.unlinkSync(`${originalPath}.webm`);

        res.status(500).json({ error: 'Transcription failed', details: error.message });
    }
};
