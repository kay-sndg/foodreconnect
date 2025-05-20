// auth.js
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000/api'
  : 'https://your-app-name.onrender.com/api';

const showNotification = (message, type = 'success') => {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
};

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    organization: document.getElementById('organization').value
  };

  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      const data = await response.json();
      showNotification('Registration successful!');
      console.log('Registered user:', data);
      document.getElementById('registerForm').reset();
    } else {
      const error = await response.json();
      showNotification(error.error || 'Registration failed', 'error');
    }
  } catch (err) {
    showNotification('Network error: ' + err.message, 'error');
  }
});
