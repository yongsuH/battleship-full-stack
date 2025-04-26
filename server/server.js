const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // 允许前端访问
    credentials: true                // 允许发送cookie
  }));
  
// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect('mongodb+srv://admin:aCQAjUVPNbl39AC5@cluster0.0sup0nn.mongodb.net/battleship?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}
connectDB();

// Routes
// authication route
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// game route
const gamesRoutes = require('./routes/games');
app.use('/api/games', gamesRoutes);

// high score
const scoresRoutes = require('./routes/scores');
app.use('/api/highscores', scoresRoutes);

// generate board
const initBoardRoutes = require('./routes/init-board');
app.use('/api/games', initBoardRoutes);

// attack
const attackRoutes = require('./routes/attack');
app.use('/api/games', attackRoutes);

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
