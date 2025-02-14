document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.querySelector('.login-btn');
    
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    errorMessage.style.display = 'none';
    
    try {
        const response = await fetch('http://localhost:3000/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            window.location.href = 'admin.html';
        } else {
            errorMessage.textContent = data.error || 'Invalid credentials';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        errorMessage.textContent = 'Error connecting to server';
        errorMessage.style.display = 'block';
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
}); 