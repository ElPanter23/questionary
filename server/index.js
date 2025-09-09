const express = require('express');
const cors = require('cors');
const path = require('path');
const questionRoutes = require('./routes/questions');
const characterRoutes = require('./routes/characters');
const gameRoutes = require('./routes/game');
const adminRoutes = require('./routes/admin');
const demoRoutes = require('./routes/demo');
const { initializeDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Determine which frontend to serve based on environment variable
const isDemoMode = process.env.DEMO_MODE === 'true';
const frontendPath = isDemoMode ? '../public-demo' : '../public';
const indexPath = isDemoMode ? 'index-demo-only.html' : 'index.html';

console.log(`Starting server in ${isDemoMode ? 'demo-only' : 'regular'} mode`);
console.log(`Serving frontend from: ${frontendPath}`);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, frontendPath)));

// Initialize database
initializeDatabase();

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/demo', demoRoutes);

// Serve Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, frontendPath, indexPath));
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
