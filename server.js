const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware lar
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// Ma'lumotlar bazasi (faqat demo, haqiqiy loyihada MongoDB yoki PostgreSQL ishlatish kerak)
let orders = [];
let freelancers = [];
let completedOrders = [];

// Ma'lumotlarni fayldan o'qish funksiyasi
function loadData() {
    try {
        if (fs.existsSync('data/orders.json')) {
            orders = JSON.parse(fs.readFileSync('data/orders.json', 'utf8'));
        }
        if (fs.existsSync('data/freelancers.json')) {
            freelancers = JSON.parse(fs.readFileSync('data/freelancers.json', 'utf8'));
        }
        if (fs.existsSync('data/completedOrders.json')) {
            completedOrders = JSON.parse(fs.readFileSync('data/completedOrders.json', 'utf8'));
        }
    } catch (error) {
        console.log('Ma\'lumotlar fayllari topilmadi, yangi fayllar yaratiladi...');
    }
}

// Ma'lumotlarni faylga yozish funksiyasi
function saveData() {
    try {
        // data papkasini yaratish
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data');
        }
        
        fs.writeFileSync('data/orders.json', JSON.stringify(orders, null, 2));
        fs.writeFileSync('data/freelancers.json', JSON.stringify(freelancers, null, 2));
        fs.writeFileSync('data/completedOrders.json', JSON.stringify(completedOrders, null, 2));
    } catch (error) {
        console.error('Ma\'lumotlarni saqlashda xatolik:', error);
    }
}

// Asosiy sahifa
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Admin sahifasi
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// Buyurtma qabul qilish API
app.post('/api/order', (req, res) => {
    try {
        const { clientName, clientWhatsApp, clientEmail, clientMessage, package } = req.body;
        
        const newOrder = {
            id: Date.now(),
            clientName,
            clientWhatsApp,
            clientEmail,
            clientMessage: clientMessage || '',
            package,
            status: 'pending',
            date: new Date().toISOString()
        };
        
        orders.push(newOrder);
        saveData();
        
        res.json({ 
            success: true, 
            message: 'Buyurtma qabul qilindi! Tez orada siz bilan bog\'lanamiz.', 
            orderId: newOrder.id 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server xatosi: ' + error.message 
        });
    }
});

// Freelancer a'zo bo'lish API
app.post('/api/freelancer', (req, res) => {
    try {
        const { 
            freelancerName, 
            freelancerCountry, 
            freelancerWhatsApp, 
            freelancerEmail, 
            freelancerLanguages, 
            freelancerSpecialty, 
            freelancerAbout 
        } = req.body;
        
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
            message: 'Arizangiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.', 
            freelancerId: newFreelancer.id 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server xatosi: ' + error.message 
        });
    }
});

// Admin API - Barcha buyurtmalarni olish
app.get('/api/admin/orders', (req, res) => {
    try {
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server xatosi: ' + error.message 
        });
    }
});

// Admin API - Barcha freelancerlarni olish
app.get('/api/admin/freelancers', (req, res) => {
    try {
        res.json({ success: true, freelancers });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server xatosi: ' + error.message 
        });
    }
});

// Admin API - Bajarilgan buyurtmalarni olish
app.get('/api/admin/completed-orders', (req, res) => {
    try {
        res.json({ success: true, completedOrders });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server xatosi: ' + error.message 
        });
    }
});

// Admin API - Buyurtmani bajarilgan deb belgilash
app.put('/api/admin/order/complete/:id', (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Buyurtma topilmadi' 
            });
        }
        
        const completedOrder = orders[orderIndex];
        completedOrder.status = 'completed';
        completedOrder.completedDate = new Date().toISOString();
        
        // Bajarilgan buyurtmalar ro'yxatiga qo'shish
        completedOrders.push(completedOrder);
        
        // Asosiy ro'yxatdan o'chirish
        orders.splice(orderIndex, 1);
        
        saveData();
        
        res.json({ 
            success: true, 
            message: 'Buyurtma bajarilgan deb belgilandi' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server xatosi: ' + error.message 
        });
    }
});

// Admin API - Buyurtmani o'chirish
app.delete('/api/admin/order/:id', (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Buyurtma topilmadi' 
            });
        }
        
        orders.splice(orderIndex, 1);
        saveData();
        
        res.json({ 
            success: true, 
            message: 'Buyurtma o\'chirildi' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server xatosi: ' + error.message 
        });
    }
});

// Admin API - Freelancerni o'chirish
app.delete('/api/admin/freelancer/:id', (req, res) => {
    try {
        const freelancerId = parseInt(req.params.id);
        const freelancerIndex = freelancers.findIndex(f => f.id === freelancerId);
        
        if (freelancerIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Freelancer topilmadi' 
            });
        }
        
        freelancers.splice(freelancerIndex, 1);
        saveData();
        
        res.json({ 
            success: true, 
            message: 'Freelancer o\'chirildi' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server xatosi: ' + error.message 
        });
    }
});

// Admin login API
app.post('/api/admin/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Login va parolni tekshirish
        if (username === 'truslon' && password === 'ruslonbek11') {
            res.json({ 
                success: true, 
                message: 'Login successful', 
                token: 'admin-auth-token' 
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Login yoki parol noto\'g\'ri' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server xatosi: ' + error.message 
        });
    }
});

// Boshqa barcha so'rovlar uchun asosiy sahifaga yo'naltirish
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serverni ishga tushurish
app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishga tushdi`);
    console.log(`Sayt manzili: http://localhost:${PORT}`);
    
    // Ma'lumotlarni yuklash
    loadData();
    console.log(`${orders.length} ta buyurtma yuklandi`);
    console.log(`${freelancers.length} ta freelancer yuklandi`);
    console.log(`${completedOrders.length} ta bajarilgan buyurtma yuklandi`);
});

module.exports = app;
