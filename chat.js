document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:3000');
    const messageArea = document.getElementById('messageArea');
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const connectionStatus = document.getElementById('connectionStatus');

    // Generate a random client ID if not exists
    const clientId = localStorage.getItem('clientId') || 
        Math.random().toString(36).substring(7);
    localStorage.setItem('clientId', clientId);

    // Connection status handling
    socket.on('connect', () => {
        connectionStatus.textContent = 'Connected';
        connectionStatus.className = 'online';
        
        // Send client identification
        socket.emit('identify', { clientId });
    });

    socket.on('disconnect', () => {
        connectionStatus.textContent = 'Disconnected';
        connectionStatus.className = 'offline';
    });

    // Message handling
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        
        if (message) {
            // Send message to server
            socket.emit('message', {
                clientId,
                message,
                timestamp: new Date().toISOString()
            });

            // Add message to chat
            addMessage(message, 'sent');
            messageInput.value = '';
        }
    });

    socket.on('message', (data) => {
        if (data.clientId !== clientId) {
            addMessage(data.message, 'received');
        }
    });

    function addMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        
        const time = new Date().toLocaleTimeString();
        messageElement.innerHTML = `
            ${message}
            <span class="time">${time}</span>
        `;

        messageArea.appendChild(messageElement);
        messageArea.scrollTop = messageArea.scrollHeight;
    }
});