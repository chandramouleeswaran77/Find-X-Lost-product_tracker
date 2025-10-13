# Backend Testing Instructions

## Prerequisites Check

1. **MongoDB Installation**: Make sure MongoDB is installed and running
   - Download from: https://www.mongodb.com/try/download/community
   - Start MongoDB service: `mongod` or `net start MongoDB`

2. **Java 17**: Verify Java version
   ```bash
   java -version
   ```

## Running the Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Start MongoDB (if not already running):
   ```bash
   mongod
   ```

3. In a new terminal, run the Spring Boot application:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

4. Test the API endpoints:
   ```bash
   # Test lost items endpoint
   curl http://localhost:8080/api/lost
   
   # Test found items endpoint
   curl http://localhost:8080/api/found
   
   # Test authentication
   curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"123123\"}"
   ```

## Expected Results

- Application should start on port 8080
- Sample data should be automatically loaded
- API endpoints should return JSON responses
- CORS should be configured for frontend at localhost:5173

## Troubleshooting

- If MongoDB connection fails, ensure MongoDB is running on localhost:27017
- If port 8080 is in use, change server.port in application.properties
- Check console logs for any startup errors
