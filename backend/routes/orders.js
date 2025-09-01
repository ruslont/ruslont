const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '../../data/orders.json');

// Ensure data directory and file exist
function ensureDataFile() {
    const dataDir = path.dirname(dataPath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(dataPath)) {
        fs.writeFileSync(dataPath, JSON.stringify([]));
    }
}

// Read orders from file
function readOrders() {
    ensureDataFile();
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading orders:', error);
        return [];
    }
}

// Write orders to file
function writeOrders(orders) {
    ensureDataFile();
    try {
        fs.writeFileSync(dataPath, JSON.stringify(orders, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing orders:', error);
        return false;
    }
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

// Get all orders
router.get('/', (req, res) => {
    const orders = readOrders();
    res.json(orders);
});

// Get order by ID
router.get('/:id', (req, res) => {
    const orders = readOrders();
    const order = orders.find(o => o.id == req.params.id);
    
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
});

// Create new order
router.post('/', (req, res) => {
    const { name, whatsapp, email, service, details } = req.body;
    
    if (!name || !whatsapp || !email || !service || !details) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const orders = readOrders();
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
    
    if (writeOrders(orders)) {
        res.status(201).json(newOrder);
    } else {
        res.status(500).json({ error: 'Failed to save order' });
    }
});

// Update order
router.put('/:id', (req, res) => {
    const orders = readOrders();
    const index = orders.findIndex(o => o.id == req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    const updatedOrder = { ...orders[index], ...req.body };
    orders[index] = updatedOrder;
    
    if (writeOrders(orders)) {
        res.json(updatedOrder);
    } else {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// Delete order
router.delete('/:id', (req, res) => {
    const orders = readOrders();
    const filteredOrders = orders.filter(o => o.id != req.params.id);
    
    if (orders.length === filteredOrders.length) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    if (writeOrders(filteredOrders)) {
        res.json({ message: 'Order deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

module.exports = router;
