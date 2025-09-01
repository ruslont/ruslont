const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '../data/orders.json');
const serviceDemandPath = path.join(__dirname, '../data/serviceDemand.json');

class Order {
    constructor(id, name, whatsapp, email, service, details, orderTime, status = 'pending') {
        this.id = id;
        this.name = name;
        this.whatsapp = whatsapp;
        this.email = email;
        this.service = service;
        this.details = details;
        this.orderTime = orderTime;
        this.status = status;
    }

    // Ensure data directory and file exist
    static ensureDataFile(filePath, defaultData = []) {
        const dataDir = path.dirname(filePath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
        }
    }

    // Read data from file
    static readData(filePath, defaultData = []) {
        Order.ensureDataFile(filePath, defaultData);
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error reading ${filePath}:`, error);
            return defaultData;
        }
    }

    // Write data to file
    static writeData(filePath, data) {
        Order.ensureDataFile(filePath);
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error(`Error writing ${filePath}:`, error);
            return false;
        }
    }

    // Generate unique ID
    static generateId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    // Find all orders
    static findAll() {
        return Order.readData(dataPath);
    }

    // Find order by ID
    static findById(id) {
        const orders = Order.readData(dataPath);
        return orders.find(order => order.id == id);
    }

    // Create new order
    static create(orderData) {
        const orders = Order.readData(dataPath);
        const newOrder = {
            id: Order.generateId(),
            ...orderData,
            orderTime: new Date().toISOString(),
            status: 'pending'
        };
        
        orders.push(newOrder);
        
        if (Order.writeData(dataPath, orders)) {
            return newOrder;
        } else {
            return null;
        }
    }

    // Update order
    static update(id, updateData) {
        const orders = Order.readData(dataPath);
        const index = orders.findIndex(order => order.id == id);
        
        if (index === -1) {
            return null;
        }
        
        const updatedOrder = { ...orders[index], ...updateData };
        orders[index] = updatedOrder;
        
        if (Order.writeData(dataPath, orders)) {
            return updatedOrder;
        } else {
            return null;
        }
    }

    // Delete order
    static delete(id) {
        const orders = Order.readData(dataPath);
        const filteredOrders = orders.filter(order => order.id != id);
        
        if (orders.length === filteredOrders.length) {
            return false;
        }
        
        return Order.writeData(dataPath, filteredOrders);
    }

    // Get statistics
    static getStatistics() {
        const orders = Order.readData(dataPath);
        const today = new Date().toDateString();
        
        const todayOrders = orders.filter(order => {
            const orderDate = new Date(order.orderTime).toDateString();
            return orderDate === today;
        });
        
        const completedOrders = orders.filter(order => order.status === 'completed');
        const completionRate = orders.length > 0 
            ? Math.round((completedOrders.length / orders.length) * 100) 
            : 0;
        
        return {
            totalOrders: orders.length,
            todayOrders: todayOrders.length,
            completedOrders: completedOrders.length,
            completionRate: completionRate
        };
    }

    // Track service demand
    static trackServiceDemand(serviceName) {
        const serviceDemand = Order.readData(serviceDemandPath, {});
        
        // Initialize service count if not exists
        if (!serviceDemand[serviceName]) {
            serviceDemand[serviceName] = 0;
        }
        
        // Increment service count
        serviceDemand[serviceName] += 1;
        
        return Order.writeData(serviceDemandPath, serviceDemand);
    }

    // Get service demand statistics
    static getServiceDemand() {
        return Order.readData(serviceDemandPath, {});
    }
}

module.exports = Order;
