if (!localStorage.getItem('adminToken')) {
    window.location.href = 'admin-login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();

    // Event Listeners
    document.getElementById('statusFilter').addEventListener('change', loadOrders);
    document.getElementById('searchOrder').addEventListener('input', debounce(loadOrders, 300));
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

async function loadOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchQuery = document.getElementById('searchOrder').value;

    try {
        const response = await fetch(`http://localhost:3000/api/orders?status=${statusFilter}&search=${searchQuery}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        // Show error message to user
    }
}

function displayOrders(orders) {
    const ordersGrid = document.querySelector('.orders-grid');
    ordersGrid.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">#${order._id.slice(-6)}</span>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Service:</strong> ${order.serviceType}</p>
                <p><strong>Client:</strong> ${order.name}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div class="order-actions">
                <button class="action-btn view-btn" onclick="viewOrder('${order._id}')">View Details</button>
                <button class="action-btn update-btn" onclick="updateOrderStatus('${order._id}')">Update Status</button>
                <button class="action-btn delete-btn" onclick="deleteOrder('${order._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

async function viewOrder(orderId) {
    try {
        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch order details');
        
        const order = await response.json();
        showOrderModal(order);
    } catch (error) {
        console.error('Error viewing order:', error);
    }
}

function showOrderModal(order) {
    const modal = document.getElementById('orderModal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <h2>Order Details #${order._id.slice(-6)}</h2>
        <div class="order-info">
            <p><strong>Client Name:</strong> ${order.name}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Service Type:</strong> ${order.serviceType}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Created:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <div class="message">
                <strong>Project Details:</strong>
                <p>${order.message}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
} 