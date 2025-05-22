// scripts.js

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

// Geocode typed-in address on blur
document.addEventListener('DOMContentLoaded', () => {
  const locationInput = document.getElementById('pickupLocation');
  if (locationInput) {
    locationInput.addEventListener('blur', async () => {
      const address = locationInput.value.trim();
      if (!address) return;

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
        const data = await res.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          locationInput.dataset.lat = lat;
          locationInput.dataset.lng = lon;
          showNotification('Coordinates updated from address');
        } else {
          showNotification('Unable to geocode address', 'error');
        }
      } catch (error) {
        showNotification('Geocoding error: ' + error.message, 'error');
      }
    });
  }
});

// Submit Food Form with Image Upload
const foodForm = document.getElementById('postFoodForm');
foodForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const locationInput = document.getElementById('pickupLocation');
  let latitude = parseFloat(locationInput.dataset.lat) || null;
  let longitude = parseFloat(locationInput.dataset.lng) || null;

  if (!latitude || !longitude) {
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationInput.value)}&format=json&limit=1`);
      const geoData = await geoRes.json();
      if (geoData.length > 0) {
        latitude = parseFloat(geoData[0].lat);
        longitude = parseFloat(geoData[0].lon);
        locationInput.dataset.lat = latitude;
        locationInput.dataset.lng = longitude;
        showNotification('Coordinates auto-filled on submit');
      }
    } catch (err) {
      console.error('Geocoding on submit failed:', err);
    }
  }

  const formData = new FormData(foodForm);
  formData.append('latitude', latitude);
  formData.append('longitude', longitude);

  try {
    const response = await fetch(`${API_URL}/foods`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      showNotification('Food posted successfully!');
      closeModal('postFoodModal');
      loadFoods();
      foodForm.reset();
    } else {
      showNotification('Error posting food', 'error');
    }
  } catch (error) {
    console.error('Submit error:', error);
    showNotification('Error: ' + error.message, 'error');
  }
});

// Load Foods
async function loadFoods() {
  try {
    const response = await fetch(`${API_URL}/foods`);
    const foods = await response.json();
    displayFoods(foods);
  } catch (error) {
    console.error('Error loading foods:', error);
    displayMockFoods();
  }
}

function displayFoods(foods) {
  const foodGrid = document.getElementById('foodGrid');
  foodGrid.innerHTML = foods.map(food => createFoodCard(food)).join('');
}

function createFoodCard(food) {
  const isNew = new Date() - new Date(food.created_at) < 24 * 60 * 60 * 1000;
  return `
    <div class="food-card">
      <div style="position: relative;">
        <img src="${food.image_url || '/api/placeholder/400/200'}" alt="${food.title}" class="food-image">
        ${isNew ? '<span class="food-badge">New</span>' : ''}
      </div>
      <div class="food-details">
        <div class="food-category">${food.category}</div>
        <h3 class="food-title">${food.title}</h3>
        <p class="food-description">${food.description.substring(0, 100)}...</p>
        <div class="food-meta">
          <div class="meta-item">${food.location}</div>
          <div class="meta-item">Best before: ${new Date(food.best_before).toLocaleString()}</div>
          <div class="meta-item">Serves approx. ${food.servings}</div>
        </div>
        <button class="btn btn-primary" style="width: 100%;" onclick="openPickupModal('${food.title}', '${food.whatsapp_number}')">Request Pickup</button>
      </div>
    </div>
  `;
}

let currentPickup = { foodTitle: '', whatsapp: '' };

function openPickupModal(title, number) {
  currentPickup.foodTitle = title;
  currentPickup.whatsapp = number;
  document.getElementById('pickupFoodTitle').textContent = title;
  document.getElementById('pickupQuantity').value = '';
  document.getElementById('pickupModal').style.display = 'flex';
}

function confirmPickup() {
  const quantity = document.getElementById('pickupQuantity').value;
  const encodedMsg = encodeURIComponent(`Hi, I would like to request ${quantity} serving(s) of "${currentPickup.foodTitle}" via FoodReconnect.`);
  const phone = currentPickup.whatsapp.replace(/\D/g, '');
  const waUrl = `https://wa.me/${phone}?text=${encodedMsg}`;
  window.open(waUrl, '_blank');
}

function displayMockFoods() {
  const mockFoods = [
    {
      id: 1,
      title: "Assorted Finger Sandwiches and Pastries",
      category: "Sandwiches",
      description: "Leftover catering from corporate event. Includes vegetarian options.",
      location: "Raffles Place, Downtown Core",
      best_before: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      servings: 15,
      created_at: new Date().toISOString(),
      image_url: "/api/placeholder/400/200"
    }
  ];
  displayFoods(mockFoods);
}

// Page Routing
document.addEventListener('DOMContentLoaded', () => {
  loadFoods();

  const aboutLink = document.querySelector('a[href="#about"]');
  if (aboutLink) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('about-page');
    });
  }
});

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const target = document.getElementById(pageId);
  if (target) target.style.display = 'block';
}

// Modal close on outside click
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
};
