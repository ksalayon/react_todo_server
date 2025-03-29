require('dotenv').config();
const express = require('express');
const cors = require('cors');
const usersRoutes = require('./routes/usersRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));

// Middleware
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send('API running');
});

// API routes
app.use('/login', authenticationRoutes);
app.use('/users', usersRoutes);

// Start the server
app.listen(port, () => console.log(`🚀 Server running on port: ${port}`));