CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    organization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS foods (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    cuisine_type VARCHAR(100),
    servings INTEGER,
    best_before TIMESTAMP,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    image_url TEXT,
    provider_id INTEGER REFERENCES users(id),
    whatsapp_number VARCHAR(20) NOT NULL, -- ✅ added
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'available'
);

CREATE TABLE IF NOT EXISTS pickups (
    id SERIAL PRIMARY KEY,
    food_id INTEGER REFERENCES foods(id),
    user_id INTEGER REFERENCES users(id),
    pickup_time TIMESTAMP,
    status VARCHAR(50) DEFAULT 'requested',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_foods_status ON foods(status);
CREATE INDEX idx_foods_best_before ON foods(best_before);
CREATE INDEX idx_foods_location ON foods(latitude, longitude);
CREATE INDEX idx_pickups_food_id ON pickups(food_id);
CREATE INDEX idx_pickups_user_id ON pickups(user_id);

-- Insert sample data
INSERT INTO users (name, email, phone, organization) VALUES
    ('John Doe', 'john@example.com', '+65 9123 4567', 'ABC Corporation'),
    ('Jane Smith', 'jane@example.com', '+65 9876 5432', 'Wedding Planners Association'),
    ('Mike Chen', 'mike@example.com', '+65 8765 4321', 'Community Center');

INSERT INTO foods (
    title, category, description, cuisine_type, servings, best_before,
    location, latitude, longitude, image_url, provider_id, whatsapp_number
) VALUES
    (
      'Assorted Finger Sandwiches and Pastries', 'Sandwiches',
      'Leftover catering from corporate event. Includes vegetarian options. All individually wrapped and fresh.',
      'Western', 15, CURRENT_TIMESTAMP + INTERVAL '5 hours',
      'Raffles Place, Downtown Core', 1.2847, 103.8514,
      'https://example.com/sandwich.jpg', 1, '+6591234567'
    ),
    (
      'Vegetarian Buffet Items - Indian Cuisine', 'Buffet',
      'Surplus food from wedding reception. Contains dal, vegetable curry, rice, and naan bread. Well maintained at proper temperature.',
      'Indian', 25, CURRENT_TIMESTAMP + INTERVAL '3 hours',
      'Little India', 1.3066, 103.8494,
      'https://example.com/indian.jpg', 2, '+6598765432'
    ),
    (
      'Gourmet Cheese Platter and Fruits', 'Appetizers',
      'Untouched cheese board from networking event. Premium selection with crackers and fresh fruit.',
      'International', 10, CURRENT_TIMESTAMP + INTERVAL '4 hours',
      'Marina Bay Sands', 1.2838, 103.8607,
      'https://example.com/cheese.jpg', 1, '+6587654321'
    );

-- Create a view for available foods with provider info
CREATE VIEW available_foods_view AS
SELECT 
    f.*,
    u.name as provider_name,
    u.organization as provider_organization,
    u.phone as provider_phone
FROM foods f
JOIN users u ON f.provider_id = u.id
WHERE f.status = 'available' AND f.best_before > CURRENT_TIMESTAMP;
