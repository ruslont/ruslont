n const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Email konfiguratsiyasi
const emailConfig = {
    service: 'mail.ru',
    auth: {
        user: 'ruslontoraboyev@mail.ru',
        pass: 'mening saytim shunday' // Sizning haqiqiy app password ingizni qo'ying
    }
};

// Email yuborish funksiyasi
async function sendOrderEmail(orderData) {
    try {
        // Email transporter yaratish
        const transporter = nodemailer.createTransporter(emailConfig);
        
        // Email matni
        const emailText = `
            YANGI BUYURTMA!
            
            Mijoz Ma'lumotlari:
            Ism: ${orderData.name}
            WhatsApp: ${orderData.whatsapp}
            Email: ${orderData.email}
            
            Xizmat Turi: ${orderData.service}
            
            Buyurtma Tafsilotlari:
            ${orderData.details}
            
            Buyurtma Vaqti: ${new Date(orderData.orderTime).toLocaleString()}
            Buyurtma ID: ${orderData.id}
        `;
        
        const emailHtml = `
            <h2>YANGI BUYURTMA!</h2>
            <p><strong>Mijoz Ma'lumotlari:</strong></p>
            <ul>
                <li><strong>Ism:</strong> ${orderData.name}</li>
                <li><strong>WhatsApp:</strong> ${orderData.whatsapp}</li>
                <li><strong>Email:</strong> ${orderData.email}</li>
            </ul>
            
            <p><strong>Xizmat Turi:</strong> ${orderData.service}</p>
            
            <p><strong>Buyurtma Tafsilotlari:</strong></p>
            <p>${orderData.details}</p>
            
            <p><strong>Buyurtma Vaqti:</strong> ${new Date(orderData.orderTime).toLocaleString()}</p>
            <p><strong>Buyurtma ID:</strong> ${orderData.id}</p>
        `;
        
        // Email yuborish
        const mailOptions = {
            from: emailConfig.auth.user,
            to: 'ruslontoraboyev0@gmail.com',
            subject: `Yangi Buyurtma: ${orderData.service} - ${orderData.name}`,
            text: emailText,
            html: emailHtml
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Email yuborildi:', result.messageId);
        return true;
        
    } catch (error) {
        console.error('Email yuborishda xatolik:', error);
        return false;
    }
}

// Data file paths
const dataDir = path.join(__dirname, '..', 'data');
const dataPath = path.join(dataDir, 'orders.json');

// Ensure data directory and files exist
function ensureDataFiles() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
    }
}

// Read data from file
function readData(filePath, defaultData = []) {
    try {
        if (!fs.existsSync(filePath)) {
            return defaultData;
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return defaultData;
    }
}

// Write data to file
function writeData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Ensure data files exist on startup
ensureDataFiles();

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Server is running correctly'
    });
});

// Create new order
app.post('/api/orders', async (req, res) => {
    try {
        const { name, whatsapp, email, service, details } = req.body;
        
        if (!name || !whatsapp || !email || !service || !details) {
            return res.status(400).json({ error: 'Barcha maydonlar to\'ldirilishi shart' });
        }
        
        const orders = readData(dataPath, []);
        const newOrder = {
            id: generateId(),
            name,
            whatsapp,
            email,
            service,
            details,
            orderTime: new Date().toISOString(),
            status: 'pending'
        };
        
        orders.push(newOrder);
        
        // Ma'lumotlarni saqlash
        const saveSuccess = writeData(dataPath, orders);
        
        // Email yuborish
        const emailSuccess = await sendOrderEmail(newOrder);
        
        if (saveSuccess) {
            res.status(201).json({
                success: true,
                message: 'Buyurtma qabul qilindi',
                order: newOrder,
                emailSent: emailSuccess
            });
        } else {
            res.status(500).json({ 
                success: false,
                error: 'Buyurtmani saqlab bo\'lmadi' 
            });
        }
    } catch (error) {
        console.error('Buyurtma yaratishda xatolik:', error);
        res.status(500).json({ 
            success: false,
            error: 'Buyurtma yaratishda xatolik' 
        });
    }
});

// Get all orders (faqat admin uchun kerak bo'lsa)
app.get('/api/orders', (req, res) => {
    try {
        const orders = readData(dataPath, []);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Ma\'lumotlarni o\'qib bo\'lmadi' });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    const frontendPath = path.join(__dirname, '..', 'frontend', 'index.html');
    
    if (fs.existsSync(frontendPath)) {
        res.sendFile(frontendPath);
    } else {
        res.status(404).json({ 
            error: 'Frontend fayllari topilmadi'
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Sahifa topilmadi' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server xatosi:', err);
    res.status(500).json({ 
        error: 'Serverda ichki xatolik'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT}-portda ishga tushdi`);
    console.log(`🌐 Sayt: http://localhost:${PORT}`);
});
