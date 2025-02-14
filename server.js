const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Database connection
mongoose.connect('mongodb://localhost:27017/portfolio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Project Schema
const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    category: String,
    technologies: [String],
    liveUrl: String,
    githubUrl: String,
    featured: Boolean
});

const Project = mongoose.model('Project', projectSchema);

// Service Request Schema
const serviceRequestSchema = new mongoose.Schema({
    name: String,
    email: String,
    serviceType: String,
    message: String,
    status: String,
    createdAt: { type: Date, default: Date.now }
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
    name: String,
    email: String,
    serviceType: String,
    message: String,
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
    clientId: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching projects' });
    }
});

app.post('/api/service-request', async (req, res) => {
    try {
        const request = new ServiceRequest(req.body);
        await request.save();
        res.json({ message: 'Request submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting request' });
    }
});

// Create new order
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json({ message: 'Order submitted successfully', orderId: order._id });
    } catch (error) {
        res.status(500).json({ error: 'Error submitting order' });
    }
});

// Get all orders (admin only)
app.get('/api/orders', authenticateAdmin, async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};
        
        if (status && status !== 'all') {
            query.status = status;
        }
        
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { email: new RegExp(search, 'i') },
                { serviceType: new RegExp(search, 'i') }
            ];
        }
        
        const orders = await Order.find(query).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Get single order (admin only)
app.get('/api/orders/:id', authenticateAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order' });
    }
});

// Update order status (admin only)
app.patch('/api/orders/:id', authenticateAdmin, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error updating order' });
    }
});

// Delete order (admin only)
app.delete('/api/orders/:id', authenticateAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order' });
    }
});

// Admin authentication
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    console.log('Login attempt:', { username, password });
    console.log('Expected:', { 
        username: process.env.ADMIN_USERNAME, 
        password: process.env.ADMIN_PASSWORD 
    });
    
    // Replace with your actual admin credentials
    if (username === process.env.ADMIN_USERNAME && 
        password === process.env.ADMIN_PASSWORD) {
        console.log('Login successful');
        res.json({ token: process.env.ADMIN_TOKEN });
    } else {
        console.log('Login failed');
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Middleware to authenticate admin
function authenticateAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// Socket.IO handling
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('identify', (data) => {
        socket.clientId = data.clientId;
        // Load previous messages for this client
        ChatMessage.find({ clientId: data.clientId })
            .sort('-timestamp')
            .limit(50)
            .exec()
            .then(messages => {
                socket.emit('previous-messages', messages.reverse());
            });
    });

    socket.on('message', async (data) => {
        // Save message to database
        const chatMessage = new ChatMessage({
            clientId: data.clientId,
            message: data.message
        });
        await chatMessage.save();

        // Broadcast message to all connected clients
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Update the server listen call
server.listen(3000, () => {
    console.log('Server running on port 3000');
}); 