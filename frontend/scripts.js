const API_URL = "./api";

// Notifications
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// Modal Controls
function showPostFoodModal() {
  document.getElementById('postFoodModal').classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('show');
  modal.style.display = 'none';
}

// Geolocation
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          document.getElementById('pickupLocation').value = data.display_name;
          document.getElementById('pickupLocation').dataset.lat = latitude;
          document.getElementById('pickupLocation').dataset.lng = longitude;
          showNotification('Location retrieved successfully');
        } catch (error) {
          showNotification('Error getting address', 'error');
        }
      },
      (error) => {
        showNotification('Error getting location: ' + error.message, 'error');
      }
    );
  } else {
    showNotification('Geolocation not supported by your browser', 'error');
  }
}
