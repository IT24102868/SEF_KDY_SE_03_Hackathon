const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors()); // Allows your React frontend to connect
app.use(express.json());

// Dummy route for now to test connection
app.get('/api/services/going-abroad', (req, res) => {
    res.json([
        { id: 1, title: 'Passport Application', status: 'pending' },
        { id: 2, title: 'Visa Appointment', status: 'pending' }
    ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));