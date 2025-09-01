const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '../../data/orders.json');
const serviceDemandPath = path.join(__dirname, '../../data/serviceDemand.json');

// Ensure data directory and file exist
function ensureDataFile(filePath, defaultData = []) {
    const dataDir = path.dirname(filePath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    }
}

// Read data from file
function readData(filePath, defaultData = []) {
    ensureDataFile(filePath, defaultData);
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return defaultData;
    }
}

// Write data to file
function writeData(filePath, data) {
    ensureDataFile(filePath);
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

// Get all orders
exports.getAllOrders = (req, res) => {
    const orders = readData(dataPath);
    res.json(orders);
};

// Get order by ID
exports.getOrderById = (req, res) => {
    const orders = readData(dataPath);
    const order = orders.find(o => o.id == req.params.id);
    
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
};

// Create new order
exports.createOrder = (req, res) => {
    const { name, whatsapp, email, service, details } = req.body;
    
    if (!name || !whatsapp || !email || !service || !details) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const orders = readData(dataPath);
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
};

// Update order
exports.updateOrder = (req, res) => {
    const orders = readData(dataPath);
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
};

// Delete order
exports.deleteOrder = (req, res) => {
    const orders = readData(dataPath);
    const filteredOrders = orders.filter(o => o.id != req.params.id);
    
    if (orders.length === filteredOrders.length) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    if (writeData(dataPath, filteredOrders)) {
        res.json({ message: 'Order deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

// Get statistics
exports.getStatistics = (req, res) => {
    const orders = readData(dataPath);
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
};

// Track service demand
exports.trackServiceDemand = (req, res) => {
    const { service, timestamp } = req.body;
    
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
};

// Get service demand statistics
exports.getServiceDemand = (req, res) => {
    const serviceDemand = readData(serviceDemandPath, {});
    res.json(serviceDemand);
};
