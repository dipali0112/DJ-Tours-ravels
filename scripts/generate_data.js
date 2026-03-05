const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');
const tripsPath = path.join(__dirname, '../data/trips.json');
const chatHistoryPath = path.join(__dirname, '../data/chat_history.json');

// --- Data Arrays ---

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle", "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];

const destinations = [
    { city: "Paris", country: "France", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000" },
    { city: "Kyoto", country: "Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000" },
    { city: "New York", country: "USA", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=1000" },
    { city: "London", country: "UK", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1000" },
    { city: "Rome", country: "Italy", image: "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=80&w=1000" },
    { city: "Barcelona", country: "Spain", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&q=80&w=1000" },
    { city: "Sydney", country: "Australia", image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1000" },
    { city: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea90b791d2d?auto=format&fit=crop&q=80&w=1000" },
    { city: "Santorini", country: "Greece", image: "https://images.unsplash.com/photo-1613395877344-13d4c79e4284?auto=format&fit=crop&q=80&w=1000" },
    { city: "Bali", country: "Indonesia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1000" },
    { city: "Bangkok", country: "Thailand", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=1000" },
    { city: "Cairo", country: "Egypt", image: "https://images.unsplash.com/photo-1572252009286-9371d5c64a59?auto=format&fit=crop&q=80&w=1000" },
    { city: "Rio de Janeiro", country: "Brazil", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=1000" },
    { city: "Cape Town", country: "South Africa", image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=1000" },
    { city: "Reykjavik", country: "Iceland", image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80&w=1000" },
    { city: "Amsterdam", country: "Netherlands", image: "https://images.unsplash.com/photo-1512470876302-687da745ca84?auto=format&fit=crop&q=80&w=1000" },
    { city: "Prague", country: "Czech Republic", image: "https://images.unsplash.com/photo-1541849546-216549242d20?auto=format&fit=crop&q=80&w=1000" },
    { city: "Vancouver", country: "Canada", image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?auto=format&fit=crop&q=80&w=1000" },
    { city: "Singapore", country: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1000" },
    { city: "Istanbul", country: "Turkey", image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=1000" }
];

const activities = [
    "City Walking Tour", "Museum Visit", "Local Food Tasting", "Historical Landmarks", "Nature Hike",
    "Boat Cruise", "Shopping at Local Markets", "Photography Walk", "Fine Dining Experience", "Adventure Sports",
    "Cooking Class", "Art Gallery Tour", "Beach Relaxation", "Nightlife & Clubbing", "Cultural Show"
];

// --- Helpers ---

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateDateRange() {
    const start = new Date();
    start.setDate(start.getDate() + getRandomInt(-365, 365)); // Random date within +/- 1 year
    const duration = getRandomInt(3, 14);
    const end = new Date(start);
    end.setDate(end.getDate() + duration);
    return `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`;
}

// --- Generators ---

function generateUsers(count) {
    const users = [];
    for (let i = 1; i <= count; i++) {
        const firstName = getRandomElement(firstNames);
        const lastName = getRandomElement(lastNames);
        users.push({
            id: i.toString(),
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
            password: "password123",
            avatar: `https://i.pravatar.cc/150?u=${i}`,
            preferences: {
                language: getRandomElement(["en", "es", "fr", "de"]),
                currency: getRandomElement(["USD", "EUR", "GBP", "JPY"]),
                theme: getRandomElement(["light", "dark"])
            }
        });
    }
    return users;
}

function generateTrips(count, userIds) {
    const trips = [];
    const statuses = ["upcoming", "completed", "cancelled", "planning"];

    for (let i = 1; i <= count; i++) {
        const dest = getRandomElement(destinations);
        const duration = getRandomInt(3, 7);
        const itinerary = [];

        for (let d = 1; d <= duration; d++) {
            itinerary.push({
                day: d,
                activity: getRandomElement(activities)
            });
        }

        trips.push({
            id: (1000 + i).toString(),
            userId: getRandomElement(userIds),
            destination: `${dest.city}, ${dest.country}`,
            dates: generateDateRange(),
            budget: getRandomInt(1000, 10000),
            itinerary: itinerary,
            image: dest.image,
            status: getRandomElement(statuses)
        });
    }
    return trips;
}

function generateChatHistory(users) {
    const history = [];
    const userMessages = [
        "Find me flights to Paris.",
        "What are the best hotels in Tokyo?",
        "Plan a 3-day itinerary for New York.",
        "Is it safe to travel to Egypt right now?",
        "Budget friendly restaurants in Rome?",
        "Show me beaches in Bali."
    ];
    const aiResponses = [
        "Here are some flight options for you...",
        "I recommend staying at the Grand Hotel...",
        "Day 1: Central Park, Day 2: Statue of Liberty...",
        "It's generally safe, but always check travel advisories.",
        "Trattoria da Luigi is a great affordable option.",
        "Kuta Beach and Seminyak are popular choices."
    ];

    // Generate chat for 20 random users
    const selectedUsers = users.slice(0, 20);

    selectedUsers.forEach(user => {
        const messages = [];
        const msgCount = getRandomInt(1, 5);
        for (let m = 0; m < msgCount; m++) {
            messages.push({
                role: 'user',
                content: getRandomElement(userMessages),
                timestamp: new Date().toISOString()
            });
            messages.push({
                role: 'assistant',
                content: getRandomElement(aiResponses),
                timestamp: new Date().toISOString()
            });
        }
        history.push({
            userId: user.id,
            messages: messages
        });
    });
    return history;
}

// --- Main Execution ---

console.log("Generating data...");

const userCount = 50;
const tripCount = 550; // Aiming for >500

const users = generateUsers(userCount);
// Add a default admin/test user
users.unshift({
    id: "0",
    name: "Test User",
    email: "test@example.com",
    password: "password",
    avatar: "https://i.pravatar.cc/150?u=0",
    preferences: { language: "en", currency: "USD", theme: "light" }
});

const userIds = users.map(u => u.id);
const trips = generateTrips(tripCount, userIds);
const chatHistory = generateChatHistory(users);

// Write to files
try {
    // Ensure directory exists
    const dir = path.dirname(usersPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    console.log(`Generated ${users.length} users.`);

    fs.writeFileSync(tripsPath, JSON.stringify(trips, null, 2));
    console.log(`Generated ${trips.length} trips.`);

    fs.writeFileSync(chatHistoryPath, JSON.stringify(chatHistory, null, 2));
    console.log(`Generated chat history for ${chatHistory.length} users.`);

    console.log("Data generation complete.");
} catch (err) {
    console.error("Error writing files:", err);
}
