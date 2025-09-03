// backend/server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Telegram sozlamalari
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Data fayl
const dataDir = path.join(__dirname, '..', 'data');
const dataPath = path.join(dataDir, 'orders.json');

// Data katalogini yaratish
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
}

// ID generatsiya qilish
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// JSON o‘qish
function readData() {
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch {
        return [];
    }
}

// JSON yozish
function writeData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Telegramga buyurtma yuborish
async function sendOrderToTelegram(order) {
    const message = `
🆕 YANGI BUYURTMA!

👤 Ism: ${order.name}
📱 WhatsApp: ${order.whatsapp}
📧 Email: ${order.email}

🛠 Xizmat turi: ${order.service}
📝 Tafsilot: ${order.details}

⏰ Vaqt: ${new Date(order.orderTime).toLocaleString()}
🆔 ID: ${order.id}
    `;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: "HTML"
        });
        console.log("✅ Telegramga yuborildi");
        return true;
    } catch (err) {
        console.error("❌ Telegramga yuborishda xatolik:", err.message);
        return false;
    }
}

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: "OK", time: new Date().toISOString() });
});

// Buyurtma yaratish
app.post('/api/orders', async (req, res) => {
    const { name, whatsapp, email, service, details } = req.body;

    if (!name || !whatsapp || !email || !service || !details) {
        return res.status(400).json({ error: "Barcha maydonlarni to‘ldiring" });
    }

    const orders = readData();
    const newOrder = {
        id: generateId(),
        name,
        whatsapp,
        email,
        service,
        details,
        orderTime: new Date().toISOString(),
        status: "pending"
    };

    orders.push(newOrder);
    writeData(orders);

    const telegramSent = await sendOrderToTelegram(newOrder);

    res.status(201).json({
        success: true,
        message: "Buyurtma qabul qilindi",
        order: newOrder,
        telegramSent
    });
});

// Buyurtmalarni olish
app.get('/api/orders', (req, res) => {
    res.json(readData());
});

// Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// 404
app.use('*', (req, res) => {
    res.status(404).json({ error: "Sahifa topilmadi" });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} da ishlayapti`);
});
