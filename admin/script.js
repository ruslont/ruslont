// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'truslon',
    password: 'ruslonbek11'
};

// Global variables
let orders = [];
let currentOrder = null;
let timerInterval = null;
let isBackendOnline = false;
let authToken = null;

// DOM Elements
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const ordersTableBody = document.getElementById('orders-table-body');
const completedOrdersTableBody = document.getElementById('completed-orders-table-body');
const orderDetailModal = document.getElementById('order-detail-modal');
const closeDetailModal = document.getElementById('close-detail-modal');
const orderDetails = document.getElementById('order-details');
const startOrderBtn = document.getElementById('start-order-btn');
const completeOrderBtn = document.getElementById('complete-order-btn');
const deleteOrderBtn = document.getElementById('delete-order-btn');
const timerContainer = document.getElementById('timer-container');
const orderTimer = document.getElementById('order-timer');
const searchInput = document.getElementById('search-orders');
const refreshBtn = document.getElementById('refresh-btn');
const timeFilter = document.getElementById('time-filter');
const connectionStatus = document.getElementById('connection-status');
const totalOrdersElement = document.getElementById('total-orders');
const todayOrdersElement = document.getElementById('today-orders');
const completedOrdersElement = document.getElementById('completed-orders');
const completionRateElement = document.getElementById('completion-rate');
const serviceDemandElement = document.getElementById('service-demand');
const serviceLoading = document.getElementById('service-loading');
const ordersLoading = document.getElementById('orders-loading');
const ordersTable = document.getElementById('orders-table');
const completedLoading = document.getElementById('completed-loading');
const completedTable = document.getElementById('completed-table');

// API Base URL
const API_BASE_URL = '/api';

// Check if user is already logged in
function checkLoginStatus() {
    const token = localStorage.getItem('adminToken');
    const savedUsername = localStorage.getItem('adminUsername');
    
    if (token && savedUsername === ADMIN_CREDENTIALS.username) {
        authToken = token;
        showDashboard();
    }
}

// Login function
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Generate simple token (in real app, this would come from server)
        const token = btoa(`${username}:${Date.now()}`);
        authToken = token;
        
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUsername', username);
        
        showDashboard();
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

// Logout function
function handleLogout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    loginContainer.style.display = 'flex';
    dashboard.style.display = 'none';
    loginForm.reset();
}

// Show dashboard
function showDashboard() {
    loginContainer.style.display = 'none';
    dashboard.style.display = 'block';
    loadAllData();
}

// Check backend connection
async function checkBackendConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            isBackendOnline = true;
            updateConnectionStatus('connected', 'Connected to backend');
            return true;
        } else {
            throw new Error('Health check failed');
        }
    } catch (error) {
        isBackendOnline = false;
        updateConnectionStatus('disconnected', 'Backend connection failed');
        return false;
    }
}

// Update connection status
function updateConnectionStatus(status, message) {
    connectionStatus.textContent = message;
    connectionStatus.className = `connection-status ${status}`;
}

// Load all data
async function loadAllData() {
    await checkBackendConnection();
    await loadOrders();
    await loadStatistics();
    await loadServiceDemand();
}

// Load orders from backend
async function loadOrders() {
    showLoading(ordersLoading, ordersTable);
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        orders = await response.json();
        renderOrdersTable();
        renderCompletedOrdersTable();
        hideLoading(ordersLoading, ordersTable);
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('Failed to load orders', 'error');
        hideLoading(ordersLoading, ordersTable);
    }
}

// Load statistics
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/statistics`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch statistics');
        
        const stats = await response.json();
        updateStatistics(stats);
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Calculate stats locally as fallback
        calculateLocalStatistics();
    }
}

// Load service demand
async function loadServiceDemand() {
    showLoading(serviceLoading, null);
    
    try {
        const response = await fetch(`${API_BASE_URL}/service-demand`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch service demand');
        
        const serviceDemand = await response.json();
        renderServiceDemand(serviceDemand);
        hideLoading(serviceLoading, null);
    } catch (error) {
        console.error('Error loading service demand:', error);
        hideLoading(serviceLoading, null);
    }
}

// Calculate statistics locally (fallback)
function calculateLocalStatistics() {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.orderTime).toDateString();
        return orderDate === today;
    });
    
    const completedOrders = orders.filter(order => order.status === 'completed');
    const completionRate = orders.length > 0 
        ? Math.round((completedOrders.length / orders.length) * 100) 
        : 0;
    
    updateStatistics({
        totalOrders: orders.length,
        todayOrders: todayOrders.length,
        completedOrders: completedOrders.length,
        completionRate: completionRate
    });
}

// Update statistics display
function updateStatistics(stats) {
    totalOrdersElement.textContent = stats.totalOrders;
    todayOrdersElement.textContent = stats.todayOrders;
    completedOrdersElement.textContent = stats.completedOrders;
    completionRateElement.textContent = `${stats.completionRate}%`;
}

// Render service demand
function renderServiceDemand(serviceDemand) {
    if (Object.keys(serviceDemand).length === 0) {
        serviceDemandElement.innerHTML = '<p>No service demand data available</p>';
        return;
    }
    
    const sortedServices = Object.entries(serviceDemand)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5); // Show top 5 services
    
    let html = '';
    sortedServices.forEach(([service, count]) => {
        html += `
            <div class="service-item">
                <span class="service-name">${service}</span>
                <span class="service-count">${count}</span>
            </div>
        `;
    });
    
    serviceDemandElement.innerHTML = html;
}

// Render orders table
function renderOrdersTable() {
    ordersTableBody.innerHTML = '';
    
    const filteredOrders = orders.filter(order => order.status !== 'completed');
    
    if (filteredOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    No pending orders found
                </td>
            </tr>
        `;
        return;
    }
    
    filteredOrders.forEach(order => {
        const tr = document.createElement('tr');
        
        const orderTime = new Date(order.orderTime);
        const formattedTime = orderTime.toLocaleString();
        
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td>${order.service}</td>
            <td>${formattedTime}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <button class="action-btn btn-view" data-id="${order.id}">View</button>
            </td>
        `;
        
        ordersTableBody.appendChild(tr);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.getAttribute('data-id');
            viewOrderDetails(orderId);
        });
    });
}

// Render completed orders table
function renderCompletedOrdersTable() {
    completedOrdersTableBody.innerHTML = '';
    
    let completedOrders = orders.filter(order => order.status === 'completed');
    
    // Apply time filter
    const filterValue = timeFilter.value;
    if (filterValue !== 'all') {
        const now = new Date();
        completedOrders = completedOrders.filter(order => {
            const orderDate = new Date(order.orderTime);
            
            switch (filterValue) {
                case 'today':
                    return orderDate.toDateString() === now.toDateString();
                case 'week':
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() - now.getDay());
                    weekStart.setHours(0, 0, 0, 0);
                    return orderDate >= weekStart;
                case 'month':
                    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                    return orderDate >= monthStart;
                default:
                    return true;
            }
        });
    }
    
    if (completedOrders.length === 0) {
        completedOrdersTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    No completed orders found
                </td>
            </tr>
        `;
        return;
    }
    
    completedOrders.forEach(order => {
        const tr = document.createElement('tr');
        
        const orderTime = new Date(order.orderTime);
        const formattedTime = orderTime.toLocaleString();
        
        // Mask sensitive information
        const maskedWhatsApp = maskString(order.whatsapp, 3, 4);
        const maskedEmail = maskEmail(order.email);
        
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td>${maskedWhatsApp}</td>
            <td>${maskedEmail}</td>
            <td>${order.service}</td>
            <td>${formattedTime}</td>
        `;
        
        completedOrdersTableBody.appendChild(tr);
    });
}

// Mask string for privacy
function maskString(str, visibleStart, visibleEnd) {
    if (str.length <= visibleStart + visibleEnd) {
        return str;
    }
    
    const start = str.substring(0, visibleStart);
    const end = str.substring(str.length - visibleEnd);
    const masked = '*'.repeat(str.length - visibleStart - visibleEnd);
    
    return start + masked + end;
}

// Mask email for privacy
function maskEmail(email) {
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    
    const username = parts[0];
    const domain = parts[1];
    
    if (username.length <= 2) {
        return username + '@' + domain;
    }
    
    const maskedUsername = username.substring(0, 3) + '*'.repeat(username.length - 3);
    return maskedUsername + '@' + domain;
}

// View order details
function viewOrderDetails(orderId) {
    currentOrder = orders.find(order => order.id == orderId);
    
    if (!currentOrder) return;
    
    const orderTime = new Date(currentOrder.orderTime);
    const formattedTime = orderTime.toLocaleString();
    
    orderDetails.innerHTML = `
        <div class="detail-item">
            <h4>Order ID</h4>
            <p>${currentOrder.id}</p>
        </div>
        <div class="detail-item">
            <h4>Customer Name</h4>
            <p>${currentOrder.name}</p>
        </div>
        <div class="detail-item">
            <h4>WhatsApp Number</h4>
            <p>${currentOrder.whatsapp}</p>
        </div>
        <div class="detail-item">
            <h4>Email Address</h4>
            <p>${currentOrder.email}</p>
        </div>
        <div class="detail-item">
            <h4>Service</h4>
            <p>${currentOrder.service}</p>
        </div>
        <div class="detail-item">
            <h4>Order Time</h4>
            <p>${formattedTime}</p>
        </div>
        <div class="detail-item">
            <h4>Project Details</h4>
            <p>${currentOrder.details}</p>
        </div>
        <div class="detail-item">
            <h4>Status</h4>
            <p><span class="status-badge status-${currentOrder.status}">${currentOrder.status}</span></p>
        </div>
    `;
    
    // Show/hide buttons based on status
    if (currentOrder.status === 'pending') {
        startOrderBtn.style.display = 'block';
        completeOrderBtn.style.display = 'none';
        deleteOrderBtn.style.display = 'block';
        timerContainer.style.display = 'none';
    } else if (currentOrder.status === 'in-progress') {
        startOrderBtn.style.display = 'none';
        completeOrderBtn.style.display = 'block';
        deleteOrderBtn.style.display = 'block';
        timerContainer.style.display = 'block';
        
        // Start timer if not already started
        if (!timerInterval && currentOrder.startTime) {
            startTimer();
        }
    } else {
        startOrderBtn.style.display = 'none';
        completeOrderBtn.style.display = 'none';
        deleteOrderBtn.style.display = 'block';
        timerContainer.style.display = 'none';
    }
    
    orderDetailModal.classList.add('active');
}

// Start order
async function startOrder() {
    if (!currentOrder) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${currentOrder.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                status: 'in-progress',
                startTime: new Date().toISOString()
            })
        });
        
        if (!response.ok) throw new Error('Failed to start order');
        
        const updatedOrder = await response.json();
        currentOrder = updatedOrder;
        
        // Update in local orders array
        const index = orders.findIndex(order => order.id === currentOrder.id);
        if (index !== -1) {
            orders[index] = currentOrder;
        }
        
        // Update UI
        startOrderBtn.style.display = 'none';
        completeOrderBtn.style.display = 'block';
        timerContainer.style.display = 'block';
        
        // Start timer
        startTimer();
        
        // Reload orders table
        renderOrdersTable();
        
        showNotification('Order started successfully', 'success');
    } catch (error) {
        console.error('Error starting order:', error);
        showNotification('Failed to start order', 'error');
    }
}

// Complete order
async function completeOrder() {
    if (!currentOrder) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${currentOrder.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                status: 'completed',
                endTime: new Date().toISOString()
            })
        });
        
        if (!response.ok) throw new Error('Failed to complete order');
        
        const updatedOrder = await response.json();
        currentOrder = updatedOrder;
        
        // Update in local orders array
        const index = orders.findIndex(order => order.id === currentOrder.id);
        if (index !== -1) {
            orders[index] = currentOrder;
        }
        
        // Stop timer
        stopTimer();
        
        // Close modal
        closeOrderDetailModal();
        
        // Reload all data
        await loadAllData();
        
        showNotification('Order completed successfully', 'success');
    } catch (error) {
        console.error('Error completing order:', error);
        showNotification('Failed to complete order', 'error');
    }
}

// Delete order
async function deleteOrder() {
    if (!currentOrder) return;
    
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${currentOrder.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete order');
        
        // Remove from local orders array
        orders = orders.filter(order => order.id !== currentOrder.id);
        
        // Close modal
        closeOrderDetailModal();
        
        // Reload all data
        await loadAllData();
        
        showNotification('Order deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting order:', error);
        showNotification('Failed to delete order', 'error');
    }
}

// Start timer
function startTimer() {
    if (!currentOrder.startTime) return;
    
    const startTime = new Date(currentOrder.startTime);
    let elapsedTime = new Date() - startTime;
    
    // Update timer immediately
    orderTimer.textContent = formatTime(elapsedTime);
    
    // Update timer every second
    timerInterval = setInterval(() => {
        elapsedTime += 1000;
        orderTimer.textContent = formatTime(elapsedTime);
    }, 1000);
}

// Stop timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Format time (ms to HH:MM:SS)
function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Close order detail modal
function closeOrderDetailModal() {
    orderDetailModal.classList.remove('active');
    stopTimer();
    currentOrder = null;
}

// Search orders
function searchOrders() {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (!searchTerm) {
        renderOrdersTable();
        return;
    }
    
    const filteredOrders = orders.filter(order => 
        order.status !== 'completed' && (
            order.name.toLowerCase().includes(searchTerm) ||
            order.service.toLowerCase().includes(searchTerm) ||
            order.id.toString().includes(searchTerm)
        )
    );
    
    ordersTableBody.innerHTML = '';
    
    if (filteredOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    No orders found matching "${searchTerm}"
                </td>
            </tr>
        `;
        return;
    }
    
    filteredOrders.forEach(order => {
        const tr = document.createElement('tr');
        
        const orderTime = new Date(order.orderTime);
        const formattedTime = orderTime.toLocaleString();
        
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td>${order.service}</td>
            <td>${formattedTime}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <button class="action-btn btn-view" data-id="${order.id}">View</button>
            </td>
        `;
        
        ordersTableBody.appendChild(tr);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.getAttribute('data-id');
            viewOrderDetails(orderId);
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]} notification-icon"></i>
        <div class="notification-content">
            <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div class="notification-message">${message}</div>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Show loading state
function showLoading(loadingElement, contentElement) {
    loadingElement.style.display = 'flex';
    if (contentElement) {
        contentElement.style.display = 'none';
    }
}

// Hide loading state
function hideLoading(loadingElement, contentElement) {
    loadingElement.style.display = 'none';
    if (contentElement) {
        contentElement.style.display = 'table';
    }
}

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
closeDetailModal.addEventListener('click', closeOrderDetailModal);
startOrderBtn.addEventListener('click', startOrder);
completeOrderBtn.addEventListener('click', completeOrder);
deleteOrderBtn.addEventListener('click', deleteOrder);
searchInput.addEventListener('input', searchOrders);
refreshBtn.addEventListener('click', loadAllData);
timeFilter.addEventListener('change', renderCompletedOrdersTable);

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target === orderDetailModal) {
        closeOrderDetailModal();
    }
});

// Close modal when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeOrderDetailModal();
    }
});

// Initialize
checkLoginStatus();

// Set up periodic connection checking (every 30 seconds)
setInterval(checkBackendConnection, 30000);
```
