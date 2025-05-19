<script>
        // API configuration
        const API_URL = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api' 
            : 'https://your-app-name.onrender.com/api';

        // Show notification
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }

        // Modal functions
        function showPostFoodModal() {
            document.getElementById('postFoodModal').style.display = 'block';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        // Get current location
        function getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Reverse geocode to get address
                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                        const data = await response.json();
                        
                        document.getElementById('pickupLocation').value = data.display_name;
                        
                        // Store coordinates for later use
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
                showNotification('Geolocation is not supported by your browser', 'error');
            }
        }

        // Find nearby food
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

        // Load all foods
        async function loadFoods() {
            try {
                const response = await fetch(`${API_URL}/foods`);
                const foods = await response.json();
                displayFoods(foods);
            } catch (error) {
                console.error('Error loading foods:', error);
                // For demo purposes, show mock data if API fails
                displayMockFoods();
            }
        }

        // Display foods in grid
        function displayFoods(foods) {
            const foodGrid = document.getElementById('foodGrid');
            foodGrid.innerHTML = foods.map(food => createFoodCard(food)).join('');
        }

        // Create food card HTML
        function createFoodCard(food) {
            const isNew = new Date() - new Date(food.created_at) < 24 * 60 * 60 * 1000;
            
            return `
                <div class="food-card" onclick="showFoodDetails('${food.id}')">
                    <div style="position: relative;">
                        <img src="${food.image_url || '/api/placeholder/400/200'}" alt="${food.title}" class="food-image">
                        ${isNew ? '<span class="food-badge">New</span>' : ''}
                    </div>
                    <div class="food-details">
                        <div class="food-category">${food.category}</div>
                        <h3 class="food-title">${food.title}</h3>
                        <p class="food-description">${food.description.substring(0, 100)}...</p>
                        <div class="food-meta">
                            <div class="meta-item">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                                ${food.location}
                            </div>
                            <div class="meta-item">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2M17 13h-5V7h1.5v4.5H17V13z"/>
                                </svg>
                                Best before: ${new Date(food.best_before).toLocaleString()}
                            </div>
                            <div class="meta-item">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2m0 2c-1.9 0-3.6.6-4.9 1.7l2.8 2.8C10.6 8.2 11.3 8 12 8s1.4.2 2.1.5l2.8-2.8C15.6 4.6 13.9 4 12 4m0 4c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z"/>
                                </svg>
                                Serves approx. ${food.servings}
                            </div>
                        </div>
                        <button class="btn btn-primary" style="width: 100%;">Request Pickup</button>
                    </div>
                </div>
            `;
        }

        // Display mock foods for demo
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
                },
                {
                    id: 2,
                    title: "Vegetarian Buffet Items - Indian Cuisine",
                    category: "Indian",
                    description: "Surplus food from wedding reception. Contains dal, vegetable curry, rice, and naan bread. Well maintained at proper temperature.",
                    location: "Little India",
                    best_before: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
                    servings: 25,
                    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                    image_url: "/api/placeholder/400/200"
                },
                {
                    id: 3,
                    title: "Gourmet Cheese Platter and Fruits",
                    category: "Appetizers",
                    description: "Untouched cheese board from networking event. Premium selection with crackers and fresh fruit.",
                    location: "Marina Bay Sands",
                    best_before: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                    servings: 10,
                    created_at: new Date().toISOString(),
                    image_url: "/api/placeholder/400/200"
                }
            ];
            
            displayFoods(mockFoods);
        }

        // Handle form submission
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
                    headers: {
                        'Content-Type': 'application/json',
                    },
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

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', loadFoods);

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target.className === 'modal') {
                event.target.style.display = 'none';
            }
        }
    </script>