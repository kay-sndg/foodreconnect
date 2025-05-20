# FoodConnect - Food Redistribution Platform

A web application that connects event organizers with surplus food to nearby community members, reducing food waste in Singapore.

## Features

- Event organizers can post surplus food items with details and location
- Users can browse available food items near their location
- Real-time geolocation-based food discovery
- Pickup request management
- Food safety information and best-before times

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Hosting**: Render.com (Backend), Any static hosting (Frontend)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- TablePlus (optional, for database management)

### Database Setup

1. Install PostgreSQL and create a new database:
```sql
CREATE DATABASE foodconnect;
```

2. Run the database setup script from `database-setup.sql` in TablePlus or PostgreSQL client

### Backend Setup

1. Clone the repository and navigate to the backend directory

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/foodconnect
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Open `index.html` in a web browser or serve it using a local server

2. Update the API URL in the frontend code if needed:
```javascript
const API_URL = 'http://localhost:3000/api';
```

### Deployment on Render.com

1. Create a new Web Service on Render.com

2. Connect your GitHub repository

3. Configure build settings:
   - Build Command: `npm install`
   - Start Command: `npm start`

4. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL database URL
   - `NODE_ENV`: production

5. Deploy the service

### API Endpoints

- `GET /api/foods` - Get all available food items
- `GET /api/foods/:id` - Get specific food item
- `GET /api/foods/nearby?lat=&lng=&radius=` - Get nearby food items
- `POST /api/foods` - Create new food listing
- `PUT /api/foods/:id` - Update food listing
- `DELETE /api/foods/:id` - Delete food listing
- `POST /api/pickups` - Create pickup request
- `PUT /api/pickups/:id` - Update pickup status
- `GET /api/users/:userId/pickups` - Get user's pickup history
- `POST /api/users` - Create new user

## Features in Detail

### For Event Organizers
- Post surplus food with detailed information
- Set best-before times
- Add location with automatic geolocation
- Upload food images
- Track pickup requests

### For Food Recipients
- Browse available food items
- Find food near current location
- View food details and safety information
- Request pickup
- Track pickup history

## Database Schema

### Users Table
- id (Primary Key)
- name
- email
- phone
- organization
- created_at

### Foods Table
- id (Primary Key)
- title
- category
- description
- cuisine_type
- servings
- best_before
- location
- latitude
- longitude
- image_url
- provider_id (Foreign Key)
- status
- created_at
- updated_at

### Pickups Table
- id (Primary Key)
- food_id (Foreign Key)
- user_id (Foreign Key)
- pickup_time
- status
- created_at

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.