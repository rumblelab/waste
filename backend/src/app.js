// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

const app = express();
app.use(helmet());
// Middleware
app.use(express.json()); // For parsing application/json

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend URL; adjust as needed
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies if needed
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
  };
  
  app.use(cors(corsOptions));
// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use(limiter);

// Use morgan for logging in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, // Necessary for SRV
    useUnifiedTopology: true, // Recommended for new connections
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Waste Management Dispatch API');
});

// Import Routes
const dispatchRoutes = require('./routes/dispatchRoutes');
const authRoutes = require('./routes/authRoutes');

// Auth Routes
app.use('/api/auth', authRoutes);

// Protect dispatch routes
const { protect, admin } = require('./middleware/authMiddleware');
app.use('/api/dispatch', dispatchRoutes);

// Error Handling Middleware
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
