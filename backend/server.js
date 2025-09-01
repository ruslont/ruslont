const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static fayllarni ulash (frontend va admin uchun)
app.use(express.static(path.join(__dirname, 'public')));

// Ma'lumotlar uchun massivlar
let orders = [];
let freelancers = [];
let completedOrders = [];

// Data papkasi
const dataDir = path.join(__dirname, 'data');

// Ma'lumotlarni yuklash
function loadData() {
    try {
        if (fs.existsSync(path.join(dataDir, 'orders.json'))) {
            orders = JSON.parse(fs.readFileSync(path.join(dataDir, 'orders.json'), 'utf8'));
        }
        if (fs.existsSync(path.join(dataDir, 'freelancers.json'))) {
            freelancers = JSON.parse(fs.readFileSync(path.join(dataDir, 'freelancers.json'), 'utf8'));
        }
        if (fs.existsSync(path.join(dataDir, 'completedOrders.json'))) {
            completedOrders = JSON.parse(fs.readFileSync(path.join(dataDir, 'completedOrders.json'), 'utf8'));
        }
    } catch (error) {
        console.log("Ma'lumotlarni yuklashda xato:", error.message);
    }
}

// Ma'lumotlarni saqlash
function saveData() {
    try {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }
        fs.writeFileSync(path.join(dataDir, 'orders.json'), JSON.stringify(orders, null, 2));
        fs.writeFileSync(path.join(dataDir, 'freelancers.json'), JSON.stringify(freelancers, null, 2));
        fs.writeFileSync(path.join(dataDir, 'completedOrders.json'), JSON.stringify(completedOrders, null, 2));
    } catch (error) {
        console.error("Ma'lumotlarni saqlashda xato:", error.message);
    }
}

// Root sahifa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin sahifasi
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// Buyurtma qabul qilish
app.post('/api/order', (req, res) => {
    try {
        const { clientName, clientWhatsApp, clientEmail, clientMessage, package: packageName } = req.body;

        const newOrder = {
            id: Date.now(),
            clientName,
            clientWhatsApp,
            clientEmail,
            clientMessage: clientMessage || '',
            package: packageName,
            status: 'pending',
            date: new Date().toISOString()
        };

        orders.push(newOrder);
        saveData();

        res.json({
            success: true,
            message: "Buyurtma qabul qilindi! Tez orada siz bilan bog'lanamiz.",
            orderId: newOrder.id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server xatosi: " + error.message });
    }
});

// Freelancer a'zo bo'lish
app.post('/api/freelancer', (req, res) => {
    try {
        const { freelancerName, freelancerCountry, freelancerWhatsApp, freelancerEmail, freelancerLanguages, freelancerSpecialty, freelancerAbout } = req.body;

        const newFreelancer = {
            id: Date.now(),
            freelancerName,
            freelancerCountry,
            freelancerWhatsApp,
            freelancerEmail,
            freelancerLanguages,
            freelancerSpecialty,
            freelancerAbout: freelancerAbout || '',
            date: new Date().toISOString(),
            status: 'new'
        };

        freelancers.push(newFreelancer);
        saveData();

        res.json({
            success: true,
            message: "Arizangiz qabul qilindi! Tez orada siz bilan bog'lanamiz.",
            freelancerId: newFreelancer.id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server xatosi: " + error.message });
    }
});

// Admin API - Barcha buyurtmalar
app.get('/api/admin/orders', (req, res) => {
    res.json({ success: true, orders });
});

// Admin API - Barcha freelancerlar
app.get('/api/admin/freelancers', (req, res) => {
    res.json({ success: true, freelancers });
});

// Admin API - Bajarilgan buyurtmalar
app.get('/api/admin/completed-orders', (req, res) => {
    res.json({ success: true, completedOrders });
});

// Serverni ishga tushirishdan oldin data yuklash
loadData();

app.listen(PORT, () => {
    console.log(`✅ Server http://localhost:${PORT} da ishlayapti`);
});
