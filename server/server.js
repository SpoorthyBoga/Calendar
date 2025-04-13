const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Adjust path if needed

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body Parser Middleware (built-in with Express)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for all origins (for development)
// For production, configure allowed origins: app.use(cors({ origin: 'YOUR_FRONTEND_URL' }));
app.use(cors());

// Define Routes
app.get('/', (req, res) => res.send('API Running')); // Simple test route
app.use('/api/events', require('./routes/events')); // Mount event routes

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));