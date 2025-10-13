# FindX Backend

A Spring Boot REST API for the FindX lost and found application.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MongoDB running on localhost:27017

## Setup

1. Make sure MongoDB is running on your local machine:
   ```bash
   mongod
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Compile the project:
   ```bash
   ./mvnw clean compile
   ```

4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Lost Items
- `GET /api/lost` - Get all lost items
- `GET /api/lost/search?q={query}` - Search lost items
- `POST /api/lost` - Create lost item report
- `GET /api/lost/{id}` - Get lost item by ID
- `PUT /api/lost/{id}` - Update lost item
- `DELETE /api/lost/{id}` - Delete lost item

### Found Items
- `GET /api/found` - Get all found items
- `GET /api/found/search?q={query}` - Search found items
- `POST /api/found` - Create found item report
- `GET /api/found/{id}` - Get found item by ID
- `PUT /api/found/{id}` - Update found item
- `DELETE /api/found/{id}` - Delete found item

### Contact Requests
- `POST /api/contact` - Create contact request
- `GET /api/contact` - Get all contact requests
- `GET /api/contact/item/{itemName}` - Get contact requests by item name

## Database

The application uses MongoDB with the following collections:
- `users` - User accounts
- `lost_items` - Lost item reports
- `found_items` - Found item reports
- `contact_requests` - Contact requests

## Sample Data

The application automatically initializes with sample data on first run, including:
- Admin user (username: admin, password: 123123)
- Sample lost and found items

## CORS Configuration

The API is configured to accept requests from `http://localhost:5173` (Vite dev server).
