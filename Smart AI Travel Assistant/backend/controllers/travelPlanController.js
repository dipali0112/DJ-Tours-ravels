const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

const DESTINATIONS_FILE = path.join(__dirname, '../data/destinations.json');

const readDestinations = () => {
    try {
        if (fs.existsSync(DESTINATIONS_FILE)) {
            return JSON.parse(fs.readFileSync(DESTINATIONS_FILE, 'utf8'));
        }
        return [];
    } catch (err) {
        console.error("Error reading destinations:", err);
        return [];
    }
};
const isMonthInBestTime = (monthName, bestTimeStr) => {
    if (!monthName || monthName === 'Anytime') return true;
    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const targetIdx = months.indexOf(monthName.toLowerCase());
    if (targetIdx === -1) return false;

    // Extract ranges like "October to March" or "November - February"
    const rangeMatch = bestTimeStr.match(/([A-Za-z]+)\s*(?:to|-)\s*([A-Za-z]+)/i);
    if (rangeMatch) {
        const startIdx = months.indexOf(rangeMatch[1].toLowerCase());
        const endIdx = months.indexOf(rangeMatch[2].toLowerCase());

        if (startIdx !== -1 && endIdx !== -1) {
            if (startIdx <= endIdx) {
                return targetIdx >= startIdx && targetIdx <= endIdx;
            } else {
                // Circular range (e.g., October to March)
                return targetIdx >= startIdx || targetIdx <= endIdx;
            }
        }
    }

    return bestTimeStr.toLowerCase().includes(monthName.toLowerCase());
};

exports.getTravelPlan = async (req, res) => {
    try {
        const { budget, month, duration, type, destination: customDest } = req.body;

        if (!budget || !month || !duration || !type) {
            return res.status(400).json({ error: 'Core preference fields are required' });
        }

        let recommendations = [];
        const isCustomDestination = customDest && customDest.trim() !== "";

        if (!isCustomDestination) {
            const destinations = readDestinations();
            const filtered = destinations.filter(dest => {
                const destPrice = parseInt(dest.price.replace(/[^\d]/g, ''));
                const matchesBudget = destPrice <= budget;
                const matchesMonth = isMonthInBestTime(month, dest.bestTimeToVisit);

                const typeMap = {
                    'Adventure': ['Adventure', 'Nature', 'Mountain'],
                    'Relax': ['Relaxing', 'Beach', 'Spiritual'],
                    'Family': ['Cultural', 'Heritage', 'Relaxing', 'Spiritual'],
                    'Honeymoon': ['Relaxing', 'Beach', 'Nature', 'Mountain'],
                    'Spiritual': ['Spiritual', 'Heritage', 'Cultural']
                };

                const relevantTypes = typeMap[type] || [];
                const matchesType = relevantTypes.some(t =>
                    dest.travelType?.toLowerCase() === t.toLowerCase() ||
                    dest.category?.toLowerCase() === t.toLowerCase()
                );

                return matchesBudget && matchesMonth && matchesType;
            });
            recommendations = filtered.slice(0, 3);
        } else {
            recommendations = [{
                id: 'custom-' + Date.now(),
                name: customDest,
                category: type,
                image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
                price: `₹${budget.toLocaleString()}`,
                description: `A personalized adventure in ${customDest}.`
            }];
        }

        if (recommendations.length === 0) {
            return res.json({
                recommendations: [],
                message: "No specific match found. Try adjusting filters or enter a custom destination!"
            });
        }

        const resultsWithItineraries = await Promise.all(recommendations.map(async (dest) => {
            try {
                const prompt = isCustomDestination
                    ? `Plan a ${duration}-day trip to ${dest.name} for ${type} with a budget of ${budget} INR.`
                    : `Generate a ${duration}-day itinerary for ${dest.name}, India (Style: ${type}).`;

                const completion = await groq.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `You are an expert World Travel Planner. Generate a JSON response: {"itinerary": [{"day": 1, "title": "...", "activities": "..."}]}`
                        },
                        { role: "user", content: prompt }
                    ],
                    model: "llama-3.1-8b-instant",
                    response_format: { type: "json_object" }
                });

                const aiResponse = JSON.parse(completion.choices[0]?.message?.content);
                return { ...dest, aiItinerary: aiResponse.itinerary };
            } catch (e) {
                console.error(`AI Error for ${dest.name}:`, e);
                return { ...dest, aiItinerary: null };
            }
        }));

        res.json({ recommendations: resultsWithItineraries });

    } catch (error) {
        console.error("Travel Plan Error:", error);
        res.status(500).json({ error: 'Failed' });
    }
};
