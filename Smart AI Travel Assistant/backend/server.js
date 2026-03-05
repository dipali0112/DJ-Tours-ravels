const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load Mock Data
const users = require('./data/users.json');
const trips = require('./data/trips.json');

const authMiddleware = require('./middleware/authMiddleware');

// --- Mock Routes ---

// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Trip Routes
app.get('/api/trips', authMiddleware, (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ message: 'User ID not found in token' });

  const userTrips = trips.filter(t => t.userId === userId);
  res.json(userTrips);
});

app.get('/api/trips/recommendations', authMiddleware, (req, res) => {
  try {
    const destinationsFile = path.join(__dirname, './data/destinations.json');
    const destinations = JSON.parse(fs.readFileSync(destinationsFile, 'utf8'));

    // Return a subset of destinations as recommendations
    // Map 'name' to 'destination' for frontend compatibility
    const recommended = destinations.slice(0, 6).map(d => ({
      ...d,
      destination: d.name,
      // Ensure budget is a number for frontend sorting/display
      budget: parseInt(d.price.toString().replace(/[^0-9]/g, '')) || 0,
      aiItinerary: [
        { day: 1, title: 'Arrival & Local Exploration', activities: `Checked into your premium stay in ${d.name}. Spend the evening exploring the local markets and enjoying a traditional welcome dinner.` },
        { day: 2, title: 'Deep Cultural Immersion', activities: 'Visit the most iconic landmarks and hidden cultural gems recommended by our AI local experts.' },
        { day: 3, title: 'Nature Adventure & Leisure', activities: 'Morning trek or nature walk followed by a relaxing afternoon at a world-class wellness spa.' }
      ]
    }));

    res.json(recommended);
  } catch (err) {
    console.error('Recommendations error:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Real AI Chat Route
const chatRoutes = require('./routes/chatRoutes');
const travelPlanRoutes = require('./routes/travelPlanRoutes');
// Chat POST (handleChat) needs optional auth for guests
app.use('/api/chat', (req, res, next) => {
  if (req.method === 'POST' && req.path === '/') {
    req.isOptional = true;
  }
  next();
}, authMiddleware, chatRoutes);
app.use('/api/travel-plan', travelPlanRoutes);

// Destinations Route
app.get('/api/destinations', (req, res) => {
  try {
    const destinationsFile = path.join(__dirname, './data/destinations.json');
    const destinations = JSON.parse(fs.readFileSync(destinationsFile, 'utf8'));
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// Contact Route
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

// Newsletter Route
const newsletterRoutes = require('./routes/newsletterRoutes');
app.use('/api/newsletter', newsletterRoutes);

// Payment Route
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payment', paymentRoutes);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});