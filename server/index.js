const express = require('express');
const cors = require('cors');
const path = require('path');
const questionRoutes = require('./routes/questions');
const characterRoutes = require('./routes/characters');
const gameRoutes = require('./routes/game');
const adminRoutes = require('./routes/admin');
const { initializeDatabase } = require('./database/init');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist/question-tool')));

// Initialize database
initializeDatabase();

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/admin', adminRoutes);

// Serve Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/question-tool/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
