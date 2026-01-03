const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const DB_FILE = './database.json';

// This checks your folder for the file
if (!fs.existsSync(DB_FILE)) {
    // If not found, it creates a new one with an empty users list
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }));
    console.log("Database file created successfully!");
}

// 1. REGISTRATION ENDPOINT
app.post('/api/register', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_FILE));
    db.users.push(req.body);
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    res.json({ message: "User registered successfully in backend!" });
});

// 2. LOGIN ENDPOINT
app.post('/api/login', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_FILE));
    const user = db.users.find(u => u.mobile === req.body.mobile && u.pin === req.body.pin);
    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
});

// 3. REAL-TIME MANDI API (Proxy through Backend to avoid CORS errors)
app.get('/api/mandi', async (req, res) => {
    const { state, apiKey } = req.query;
    const resourceId = "9ef273ef-9887-41b5-80a4-07b3212a4d36";
    
    try {
        // The Govt API is strict about the filter format
        const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&filters[state]=${state}`;
        const response = await axios.get(url);
        
        // Send only the data back to the frontend
        res.json(response.data);
    } catch (error) {
        console.error("Govt API Error:", error.message);
        res.status(500).json({ error: "Failed to fetch from Govt server" });
    }
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));