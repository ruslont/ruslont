// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'truslon',
    password: 'ruslonbek11'
};

// Global variables
let orders = [];
let currentOrder = null;
let timerInterval = null;
let authToken = localStorage.getItem('adminToken');
let currentFilter = 'all';

// DOM Elements
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const refreshBtn = document.getElementById('refresh-btn');
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
const timeFilter = document.getElementById('time-filter');
const filterButtons = document.querySelectorAll('.filter-btn');
const adminUsername = document.getElementById('admin-username');
const lastUpdated = document.getElementById('last-updated');

// Statistics elements
const totalOrdersElement = document.getElementById('total-orders');
const todayOrdersElement = document.getElementById('today-orders');
const pendingOrdersElement = document.getElementById('pending-orders');
const completedOrdersElement = document.getElementById('completed-orders');

// Check if user is already logged in
function checkLoginStatus() {
    if (authToken) {
        showDashboard();
        return true;
    }
    return false;
}

// Login function
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Generate simple token (in real app, this would come from backend)
        authToken = btoa(`${username}:${Date.now()}`);
        localStorage.setItem('adminToken', authToken);
        
        showNotification('Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            showDashboard();
        }, 1000);
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

// Logout function
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        authToken = null;
        localStorage.removeItem('adminToken');
        loginContainer.style.display = 'flex';
        dashboard.style.display = 'none';
        loginForm.reset();
        showNotification('Logged out successfully', 'success');
    }
}

// Show dashboard
function showDashboard() {
    loginContainer.style.display = 'none';
    dashboard.style.display = 'block';
    adminUsername.textContent = ADMIN_CREDENTIALS.username;
    updateLastUpdated();
    loadAllData();
}

// Update last updated time
function updateLastUpdated() {
    const now = new Date();
    lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

// Load all data
function loadAllData() {
    loadOrders();
    updateStatistics();
}

// Load orders from localStorage or demo data
function loadOrders() {
    try {
        // Try to get orders from localStorage (from frontend)
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            orders = JSON.parse(savedOrders);
        } else {
            // Load demo data if no orders in localStorage
            loadDemoData();
        }
        
        renderOrdersTable();
        renderCompletedOrdersTable();
        updateStatistics();
        
    } catch (error) {
        console.error('Error loading orders:', error);
        loadDemoData();
        showNotification('Using demo data. Real orders will appear when customers place orders.', 'info');
    }
}

// Load demo data for testing
function loadDemoData() {
    orders = [
        {
            id: 1,
            name: "John Doe",
            whatsapp: "+1234567890",
            email: "john@example.com",
            service: "Web Design",
            details: "I need a responsive website for my business with e-commerce functionality. The website should have about 10 pages including home, about, services, contact, and product pages.",
            orderTime: new Date().toISOString(),
            status: "pending"
        },
        {
            id: 2,
            name: "Jane Smith",
            whatsapp: "+0987654321",
            email: "jane@example.com",
            service: "Logo Design",
            details: "Need a modern logo for my startup company. The company name is 'TechInnovate' and we work in AI technology. Colors should be blue and white.",
            orderTime: new Date(Date.now() - 2 * 86400000).toISOString(),
            status: "completed",
            startTime: new Date(Date.now() - 2 * 86400000).toISOString(),
            endTime: new Date(Date.now() - 2 * 86400000 + 4 * 3600000).toISOString()
        },
        {
            id: 3,
            name: "Bob Johnson",
            whatsapp: "+1122334455",
            email: "bob@example.com",
            service: "Translation Work",
            details: "Need English to Russian translation for technical documentation. About 50 pages of technical manuals for software products.",
            orderTime: new Date().toISOString(),
            status: "in-progress",
            startTime: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: 4,
            name: "Alice Brown",
            whatsapp: "+998901234567",
            email: "alice@example.com",
            service: "3D Models",
            details: "Need 3D models for architectural visualization. 5 building models with interior details for real estate presentation.",
            orderTime: new Date(Date.now() - 86400000).toISOString(),
            status: "pending"
        }
    ];
}

// Update statistics
function updateStatistics() {
    const today = new Date().toDateString();
    
    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.orderTime).toDateString();
        return orderDate === today;
    });
    
    const pendingOrders = orders.filter(order => order.status === 'pending');
    const inProgressOrders = orders.filter(order => order.status === 'in-progress');
    const completedOrders = orders.filter(order => order.status === 'completed');
    
    const completionRate = orders.length > 0 
        ? Math.round((completedOrders.length / orders.length) * 100) 
        : 0;

    totalOrdersElement.textContent = orders.length;
    todayOrdersElement.textContent = todayOrders.length;
    pendingOrdersElement.textContent = pendingOrders.length;
    completedOrdersElement.textContent = completedOrders.length;
}

// Render orders table with filtering
function renderOrdersTable() {
    ordersTableBody.innerHTML = '';
    
    let filteredOrders = orders.filter(order => order.status !== 'completed');
    
    // Apply status filter
    if (currentFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === currentFilter);
    }
    
    // Apply search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredOrders = filteredOrders.filter(order => 
            order.name.toLowerCase().includes(searchTerm) ||
            order.service.toLowerCase().includes(searchTerm) ||
            order.id.toString().includes(searchTerm) ||
            order.whatsapp.includes(searchTerm)
        );
    }
    
    if (filteredOrders.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-orders">
                    ${searchTerm ? 'No orders found matching your search' : 'No active orders'}
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
            <td>#${order.id}</td>
            <td><strong>${order.name}</strong></td>
            <td>${order.service}</td>
            <td>
                <div>📱 ${order.whatsapp}</div>
                <div>📧 ${order.email}</div>
            </td>
            <td>${formattedTime}</td>
            <td><span class="status-badge status-${order.status}">${order.status.replace('-', ' ')}</span></td>
            <td>
                <button class="action-btn btn-view" data-id="${order.id}">
                    <i class="fas fa-eye"></i> View
                </button>
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
                <td colspan="7" class="no-orders">
                    No completed orders found
                </td>
            </tr>
        `;
        return;
    }
    
    completedOrders.forEach(order => {
        const tr = document.createElement('tr');
        
        const orderTime = new Date(order.orderTime);
        const completedTime = order.endTime ? new Date(order.endTime) : orderTime;
        
        tr.innerHTML = `
            <td>#${order.id}</td>
            <td><strong>${order.name}</strong></td>
            <td>${order.service}</td>
                        <td>
                <div>📱 ${order.whatsapp}</div>
                <div>📧 ${order.email}</div>
            </td>
            <td>${orderTime.toLocaleString()}</td>
            <td>${completedTime.toLocaleString()}</td>
            <td>
                <button class="action-btn btn-view" data-id="${order.id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        
        completedOrdersTableBody.appendChild(tr);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', () => {
            const orderId = btn.getAttribute('data-id');
            viewOrderDetails(orderId);
        });
    });
}

// View order details
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id == orderId);
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    currentOrder = order;
    
    const orderTime = new Date(order.orderTime);
    const startTime = order.startTime ? new Date(order.startTime) : null;
    const endTime = order.endTime ? new Date(order.endTime) : null;
    
    let timeTaken = '';
    if (startTime && endTime) {
        const diffMs = endTime - startTime;
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        timeTaken = `${hours}h ${minutes}m`;
    }
    
    orderDetails.innerHTML = `
        <div class="order-detail-section">
            <h3>Order #${order.id}</h3>
            <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status.replace('-', ' ')}</span></p>
        </div>
        
        <div class="order-detail-section">
            <h4>Client Information</h4>
            <p><strong>Name:</strong> ${order.name}</p>
            <p><strong>WhatsApp:</strong> ${order.whatsapp}</p>
            <p><strong>Email:</strong> ${order.email}</p>
        </div>
        
        <div class="order-detail-section">
            <h4>Service Details</h4>
            <p><strong>Service:</strong> ${order.service}</p>
            <p><strong>Order Time:</strong> ${orderTime.toLocaleString()}</p>
            ${startTime ? `<p><strong>Start Time:</strong> ${startTime.toLocaleString()}</p>` : ''}
            ${endTime ? `<p><strong>Completion Time:</strong> ${endTime.toLocaleString()}</p>` : ''}
            ${timeTaken ? `<p><strong>Time Taken:</strong> ${timeTaken}</p>` : ''}
        </div>
        
        <div class="order-detail-section">
            <h4>Project Details</h4>
            <p>${order.details}</p>
        </div>
    `;
    
    // Show/hide buttons based on order status
    if (order.status === 'pending') {
        startOrderBtn.style.display = 'block';
        completeOrderBtn.style.display = 'none';
        timerContainer.style.display = 'none';
        deleteOrderBtn.style.display = 'block';
    } else if (order.status === 'in-progress') {
        startOrderBtn.style.display = 'none';
        completeOrderBtn.style.display = 'block';
        timerContainer.style.display = 'block';
        deleteOrderBtn.style.display = 'none';
        
        // Start or update timer
        updateTimer();
    } else {
        startOrderBtn.style.display = 'none';
        completeOrderBtn.style.display = 'none';
        timerContainer.style.display = 'none';
        deleteOrderBtn.style.display = 'block';
    }
    
    orderDetailModal.style.display = 'block';
}

// Update timer display
function updateTimer() {
    if (!currentOrder || !currentOrder.startTime) return;
    
    clearInterval(timerInterval);
    
    const startTime = new Date(currentOrder.startTime);
    
    function update() {
        const now = new Date();
        const diffMs = now - startTime;
        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);
        
        orderTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    update();
    timerInterval = setInterval(update, 1000);
}

// Start working on an order
function startOrder() {
    if (!currentOrder) return;
    
    currentOrder.status = 'in-progress';
    currentOrder.startTime = new Date().toISOString();
    
    // Save to localStorage
    saveOrders();
    
    // Update UI
    viewOrderDetails(currentOrder.id);
    renderOrdersTable();
    updateStatistics();
    
    showNotification('Order started successfully', 'success');
}

// Complete an order
function completeOrder() {
    if (!currentOrder) return;
    
    currentOrder.status = 'completed';
    currentOrder.endTime = new Date().toISOString();
    
    // Save to localStorage
    saveOrders();
    
    // Clear timer
    clearInterval(timerInterval);
    
    // Update UI
    orderDetailModal.style.display = 'none';
    renderOrdersTable();
    renderCompletedOrdersTable();
    updateStatistics();
    
    showNotification('Order marked as completed', 'success');
}

// Delete an order
function deleteOrder() {
    if (!currentOrder || !confirm('Are you sure you want to delete this order?')) return;
    
    const index = orders.findIndex(o => o.id === currentOrder.id);
    if (index !== -1) {
        orders.splice(index, 1);
        
        // Save to localStorage
        saveOrders();
        
        // Update UI
        orderDetailModal.style.display = 'none';
        renderOrdersTable();
        renderCompletedOrdersTable();
        updateStatistics();
        
        showNotification('Order deleted successfully', 'success');
    }
}

// Save orders to localStorage
function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Show notification
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Refresh data
function refreshData() {
    loadAllData();
    showNotification('Data refreshed', 'success');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check login status on page load
    checkLoginStatus();
    
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Logout button
    logoutBtn.addEventListener('click', handleLogout);
    
    // Refresh button
    refreshBtn.addEventListener('click', refreshData);
    
    // Close modal
    closeDetailModal.addEventListener('click', () => {
        orderDetailModal.style.display = 'none';
        clearInterval(timerInterval);
    });
    
    // Start order button
    startOrderBtn.addEventListener('click', startOrder);
    
    // Complete order button
    completeOrderBtn.addEventListener('click', completeOrder);
    
    // Delete order button
    deleteOrderBtn.addEventListener('click', deleteOrder);
    
    // Search input
    searchInput.addEventListener('input', renderOrdersTable);
    
    // Time filter
    timeFilter.addEventListener('change', renderCompletedOrdersTable);
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update filter
            currentFilter = btn.getAttribute('data-filter');
            renderOrdersTable();
        });
    });
    
    // Close modal if clicked outside
    window.addEventListener('click', (e) => {
        if (e.target === orderDetailModal) {
            orderDetailModal.style.display = 'none';
            clearInterval(timerInterval);
        }
    });
});
