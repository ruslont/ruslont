const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files - To'g'ri yo'llar bilan
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Admin paneli uchun static fayllar - To'g'ri yo'l bilan
app.use('/admin', express.static(path.join(__dirname, '..', 'admin'), {
    index: 'index.html',
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Data file paths - To'g'ri yo'l bilan
const dataDir = path.join(__dirname, '..', 'data');
const dataPath = path.join(dataDir, 'orders.json');

// Ensure data directory and files exist
function ensureDataFiles() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log('📁 Created data directory:', dataDir);
    }
    
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
        console.log('📄 Created orders.json file:', dataPath);
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
        message: 'Server is running correctly',
        environment: process.env.NODE_ENV || 'development',
        paths: {
            frontend: path.join(__dirname, '..', 'frontend'),
            admin: path.join(__dirname, '..', 'admin'),
            data: dataDir
        }
    });
});

// Get all orders
app.get('/api/orders', (req, res) => {
    try {
        const orders = readData(dataPath, []);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read orders data' });
    }
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
    try {
        const orders = readData(dataPath, []);
        const order = orders.find(o => o.id == req.params.id);
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read order data' });
    }
});

// Create new order
app.post('/api/orders', (req, res) => {
    try {
        const { name, whatsapp, email, service, details } = req.body;
        
        if (!name || !whatsapp || !email || !service || !details) {
            return res.status(400).json({ error: 'All fields are required' });
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
        
        if (writeData(dataPath, orders)) {
            res.status(201).json(newOrder);
        } else {
            res.status(500).json({ error: 'Failed to save order' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update order
app.put('/api/orders/:id', (req, res) => {
    try {
        const orders = readData(dataPath, []);
        const index = orders.findIndex(o => o.id == req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        const updatedOrder = { ...orders[index], ...req.body };
        orders[index] = updatedOrder;
        
        if (writeData(dataPath, orders)) {
            res.json(updatedOrder);
        } else {
            res.status(500).json({ error: 'Failed to update order' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
    try {
        const orders = readData(dataPath, []);
        const filteredOrders = orders.filter(o => o.id != req.params.id);
        
        if (orders.length === filteredOrders.length) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        if (writeData(dataPath, filteredOrders)) {
            res.json({ message: 'Order deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete order' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

// Get statistics
app.get('/api/statistics', (req, res) => {
    try {
        const orders = readData(dataPath, []);
        const today = new Date().toDateString();
        
        const todayOrders = orders.filter(order => {
            const orderDate = new Date(order.orderTime).toDateString();
            return orderDate === today;
        });
        
        const completedOrders = orders.filter(order => order.status === 'completed');
        const completionRate = orders.length > 0 
            ? Math.round((completedOrders.length / orders.length) * 100) 
            : 0;
        
        res.json({
            totalOrders: orders.length,
            todayOrders: todayOrders.length,
            completedOrders: completedOrders.length,
            completionRate: completionRate
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to calculate statistics' });
    }
});

// Track service demand
app.post('/api/service-demand', (req, res) => {
    try {
        const { service, timestamp } = req.body;
        
        if (!service) {
            return res.status(400).json({ error: 'Service name is required' });
        }
        
        const serviceDemandPath = path.join(dataDir, 'serviceDemand.json');
        const serviceDemand = readData(serviceDemandPath, {});
        
        // Initialize service count if not exists
        if (!serviceDemand[service]) {
            serviceDemand[service] = 0;
        }
        
        // Increment service count
        serviceDemand[service] += 1;
        
        if (writeData(serviceDemandPath, serviceDemand)) {
            res.json({ message: 'Service demand tracked successfully', serviceDemand });
        } else {
            res.status(500).json({ error: 'Failed to track service demand' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to track service demand' });
    }
});

// Get service demand statistics
app.get('/api/service-demand', (req, res) => {
    try {
        const serviceDemandPath = path.join(dataDir, 'serviceDemand.json');
        const serviceDemand = readData(serviceDemandPath, {});
        res.json(serviceDemand);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read service demand data' });
    }
});

// Admin Login API
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'truslon' && password === 'ruslonbek11') {
        // Simple token generation
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        res.json({ 
            success: true, 
            message: 'Login successful',
            token: token
        });
    } else {
        res.status(401).json({ 
            success: false, 
            error: 'Invalid credentials' 
        });
    }
});

// Serve frontend - FALLBACK ROUTES
app.get('/', (req, res) => {
    const frontendPath = path.join(__dirname, '..', 'frontend', 'index.html');
    
    if (fs.existsSync(frontendPath)) {
        res.sendFile(frontendPath);
    } else {
        res.status(404).json({ 
            error: 'Frontend files not found',
            message: 'Please check if frontend files exist in the correct location',
            expectedPath: frontendPath
        });
    }
});

// Serve admin panel - FALLBACK ROUTES
app.get('/admin', (req, res) => {
    const adminPath = path.join(__dirname, '..', 'admin', 'index.html');
    
    if (fs.existsSync(adminPath)) {
        res.sendFile(adminPath);
    } else {
        res.status(404).json({ 
            error: 'Admin panel files not found',
            message: 'Please check if admin files exist in the correct location',
            expectedPath: adminPath
        });
    }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: 'Something went wrong on the server'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 Frontend: http://localhost:${PORT}`);
    console.log(`⚙️  Admin panel: http://localhost:${PORT}/admin`);
    console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
    
    // Check if files exist
    const frontendPath = path.join(__dirname, '..', 'frontend', 'index.html');
    const adminPath = path.join(__dirname, '..', 'admin', 'index.html');
    
    const frontendExists = fs.existsSync(frontendPath);
    const adminExists = fs.existsSync(adminPath);
    
    console.log(`📄 Frontend index.html exists: ${frontendExists}`);
    console.log(`📄 Admin index.html exists: ${adminExists}`);
    
    if (!frontendExists) {
        console.log('❌ WARNING: Frontend files not found!');
        console.log('   Expected path:', frontendPath);
    }
    if (!adminExists) {
        console.log('❌ WARNING: Admin files not found!');
        console.log('   Expected path:', adminPath);
    }
    
    console.log('📁 Current directory structure:');
    console.log('   ' + __dirname);
    try {
        const items = fs.readdirSync(path.join(__dirname, '..'));
        items.forEach(item => {
            console.log('   ├── ' + item);
        });
    } catch (error) {
        console.log('   Cannot read directory structure');
    }
});

module.exports = app;
