// scripts.js
// const API_URL = window.location.hostname === 'localhost' 
//   ? 'http://localhost:3000/api' 
//   : 'https://foodreconnect.onrender.com/';

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
  document.getElementById('postFoodModal').style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Geolocation
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await response.json();
        document.getElementById('pickupLocation').value = data.display_name;
        document.getElementById('pickupLocation').dataset.lat = latitude;
        document.getElementById('pickupLocation').dataset.lng = longitude;
        showNotification('Location retrieved successfully');
      } catch (error) {
        showNotification('Error getting address', 'error');
      }
    }, (error) => {
      showNotification('Error getting location: ' + error.message, 'error');
    });
  } else {
    showNotification('Geolocation not supported by your browser', 'error');
  }
}

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

// Display Foods
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
        <button class="btn btn-primary" style="width: 100%;">Request Pickup</button>
      </div>
    </div>
  `;
}

function displayMockFoods() {
  const mockFoods = [
    {
      id: 1,
      title: "Assorted Finger Sandwiches and Pastries",
      category: "Sandwiches",
      description: "Leftover catering from corporate event. Includes vegetarian options. All individually wrapped and fresh.",
      location: "Raffles Place, Downtown Core",
      best_before: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      servings: 15,
      created_at: new Date().toISOString(),
      image_url: "/api/placeholder/400/200"
    }
  ];
  displayFoods(mockFoods);
}

// Nearby Food
async function findNearbyFood() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`${API_URL}/foods/nearby?lat=${latitude}&lng=${longitude}`);
        const foods = await response.json();
        displayFoods(foods);
        showNotification(`Found ${foods.length} food items near you`);
      } catch (error) {
        showNotification('Error finding nearby food', 'error');
      }
    }, (error) => {
      showNotification('Please enable location to find nearby food', 'error');
    });
  }
}

// Form Submit
document.getElementById('postFoodForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = {
    title: document.getElementById('foodTitle').value,
    category: document.getElementById('foodCategory').value,
    description: document.getElementById('foodDescription').value,
    cuisine_type: document.getElementById('cuisineType').value,
    servings: parseInt(document.getElementById('servings').value),
    best_before: document.getElementById('bestBefore').value,
    location: document.getElementById('pickupLocation').value,
    image_url: document.getElementById('imageUrl').value || null,
    latitude: parseFloat(document.getElementById('pickupLocation').dataset.lat) || null,
    longitude: parseFloat(document.getElementById('pickupLocation').dataset.lng) || null
  };

  try {
    const response = await fetch(`${API_URL}/foods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      showNotification('Food posted successfully!');
      closeModal('postFoodModal');
      loadFoods();
      document.getElementById('postFoodForm').reset();
    } else {
      showNotification('Error posting food', 'error');
    }
  } catch (error) {
    showNotification('Error: ' + error.message, 'error');
  }
});

// Page Routing
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  const target = document.getElementById(pageId);
  if (target) target.style.display = 'block';
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadFoods();

  // JS routing link
  const aboutLink = document.querySelector('a[href="#about"]');
  if (aboutLink) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('about-page');
    });
  }
});

// Modal close on outside click
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
  }
};
