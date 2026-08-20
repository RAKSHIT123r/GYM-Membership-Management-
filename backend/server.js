const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/trainers', require('./routes/trainerRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/lockers', require('./routes/lockerRoutes'));
app.use('/api/branches', require('./routes/branchRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', service: 'ApexFit API Server', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[ApexFit Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
