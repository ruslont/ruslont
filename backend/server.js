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

// Static files (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Admin paneli uchun static fayllar
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Data file paths
const dataDir = path.join(__dirname, '../data');
const dataPath = path.join(dataDir, 'orders.json');
const serviceDemandPath = path.join(dataDir, 'serviceDemand.json');

// Ensure data directory and files exist
function ensureDataFiles() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify([], null, 2));
    }
    
    if (!fs.existsSync(serviceDemandPath)) {
        fs.writeFileSync(serviceDemandPath, JSON.stringify({}, null, 2));
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
        const { service } = req.body;
        
        if (!service) {
            return res.status(400).json({ error: 'Service name is required' });
        }
        
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
        const serviceDemand = readData(serviceDemandPath, {});
        res.json(serviceDemand);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read service demand data' });
    }
});

// Serve frontend - FALLBACK ROUTES
app.get('/', (req, res) => {
    const frontendPath = path.join(__dirname, '../frontend', 'index.html');
    
    if (fs.existsSync(frontendPath)) {
        res.sendFile(frontendPath);
    } else {
        res.status(404).json({ 
            error: 'Frontend files not found',
            message: 'Please check if frontend files exist in the correct location'
        });
    }
});

// Serve admin panel - FALLBACK ROUTES
app.get('/admin', (req, res) => {
    const adminPath = path.join(__dirname, '../admin', 'index.html');
    
    if (fs.existsSync(adminPath)) {
        res.sendFile(adminPath);
    } else {
        res.status(404).json({ 
            error: 'Admin panel files not found',
            message: 'Please check if admin files exist in the correct location'
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
    console.log(`📁 Current directory: ${__dirname}`);
    
    // Check if files exist
    const frontendExists = fs.existsSync(path.join(__dirname, '../frontend', 'index.html'));
    const adminExists = fs.existsSync(path.join(__dirname, '../admin', 'index.html'));
    
    console.log(`📄 Frontend index.html exists: ${frontendExists}`);
    console.log(`📄 Admin index.html exists: ${adminExists}`);
    
    if (!frontendExists) {
        console.log('❌ WARNING: Frontend files not found!');
    }
    if (!adminExists) {
        console.log('❌ WARNING: Admin files not found!');
    }
});

module.exports = app;

// server.js faylining oxiriga quyidagilarni qo'shing:

// Admin Login API
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'truslon' && password === 'ruslonbek11') {
        // Simple token generation (in real app use JWT)
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

// Admin authentication middleware
function authenticateAdmin(req, res, next) {
    const token = req.headers.authorization;
    
    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    // Simple token verification (in real app verify JWT)
    const authToken = token.replace('Bearer ', '');
    try {
        const decoded = Buffer.from(authToken, 'base64').toString('utf-8');
        const [username] = decoded.split(':');
        
        if (username === 'truslon') {
            next();
        } else {
            res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Invalid token format' });
    }
}

// Protect all admin routes
app.use('/api/admin/*', authenticateAdmin);

// Admin statistics
app.get('/api/admin/statistics', (req, res) => {
    try {
        const orders = readData(dataPath, []);
        const today = new Date().toDateString();
        
        const todayOrders = orders.filter(order => {
            const orderDate = new Date(order.orderTime).toDateString();
            return orderDate === today;
        });
        
        const completedOrders = orders.filter(order => order.status === 'completed');
        const pendingOrders = orders.filter(order => order.status === 'pending');
        const inProgressOrders = orders.filter(order => order.status === 'in-progress');
        
        const completionRate = orders.length > 0 
            ? Math.round((completedOrders.length / orders.length) * 100) 
            : 0;

        res.json({
            totalOrders: orders.length,
            todayOrders: todayOrders.length,
            completedOrders: completedOrders.length,
            pendingOrders: pendingOrders.length,
            inProgressOrders: inProgressOrders.length,
            completionRate: completionRate
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});
