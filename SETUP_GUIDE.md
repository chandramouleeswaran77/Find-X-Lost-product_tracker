# Find_X Platform - Enhanced Setup Guide

## Prerequisites

- **Node.js** (v16 or higher)
- **Java** (v17 or higher)
- **Maven** (v3.6 or higher)
- **MongoDB** (v4.4 or higher)

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
The Maven dependencies will be automatically downloaded when you build the project. The key new dependency added is:
- **iText PDF** (v5.5.13.3) for PDF report generation

### 3. Configure Application Properties

Edit `src/main/resources/application.properties`:

```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/findx

# JWT Configuration
jwt.secret=your-secret-key-here-make-it-long-and-secure
jwt.expiration=86400000

# Email Configuration (Optional - for notifications)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Server Configuration
server.port=8080
```

### 4. Build and Run Backend
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Endpoint

Verify `src/apiClient.js` has the correct backend URL:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 4. Run Frontend
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

---

## Initial Setup

### 1. Create Admin User

Connect to your MongoDB and create an admin user:

```javascript
db.users.insertOne({
  username: "admin",
  name: "Admin User",
  email: "admin@findx.com",
  role: "ADMIN",
  password: "$2a$10$hashedPasswordHere", // Use bcrypt to hash
  phoneNumber: "1234567890",
  pictureUrl: "",
  rollNo: "ADMIN001"
});
```

Or use the Google OAuth login and manually update the user's role to "ADMIN" in MongoDB:
```javascript
db.users.updateOne(
  { email: "your-google-email@gmail.com" },
  { $set: { role: "ADMIN" } }
);
```

### 2. Test the Application

1. **Login**: Navigate to `http://localhost:5173` and login with Google OAuth
2. **Theme**: Click the theme toggle (sun/moon icon) in the navbar
3. **Report Items**: Test reporting lost and found items
4. **Search**: Use the search bar with partial keywords
5. **Filters**: Click the "Filters" button on Lost/Found pages
6. **Admin Dashboard**: If you're an admin, you'll see an "Admin" link in the navbar
7. **PDF Reports**: In admin dashboard, generate monthly reports

---

## New Features Guide

### Theme Toggle
- Click the sun/moon icon in the navbar
- Theme preference is saved and persists across sessions
- All pages and components adapt to the selected theme

### Enhanced Search
- Type in the search bar (debounced - waits 300ms after you stop typing)
- Searches item name, description, and location
- Partial matching: "pods" matches "AirPods"
- Case-insensitive

### Filters (Lost/Found Pages)
- Click "Filters" button
- Choose from:
  - **All Items**: Show everything
  - **Open**: Unmatched and unresolved items
  - **Matched**: Items with potential matches
  - **Resolved**: Closed/resolved items

### Smart Matching
- System automatically matches lost and found items
- Uses intelligent keyword extraction
- Handles variations (phone/mobile, airpods/pods)
- Sends email notifications (if email is configured)
- In-app notifications visible in notification bell

### Admin Dashboard
- Access via navbar "Admin" link (admin users only)
- View overall statistics
- Generate monthly PDF reports
- Select month and year, click "Generate Report"
- PDF automatically downloads

### Auto-Fill Forms
- When reporting lost/found items
- Name and email fields auto-populate from your profile
- Fields are read-only (cannot be edited)

### Activity Timeline
- Shows recent lost/found activities
- Color-coded by type (red for lost, blue for found)
- Match indicators for items with matches
- Time-ago format (e.g., "2h ago")

---

## Troubleshooting

### Backend Issues

**Problem**: Maven dependencies not downloading
```bash
# Clear Maven cache and reinstall
mvn clean
mvn dependency:purge-local-repository
mvn install
```

**Problem**: MongoDB connection refused
- Ensure MongoDB is running: `mongod` or `brew services start mongodb-community`
- Check MongoDB URI in application.properties

**Problem**: Email notifications not working
- Verify SMTP settings in application.properties
- For Gmail, use an App Password, not your regular password
- Enable "Less secure app access" or use OAuth2

### Frontend Issues

**Problem**: Port 5173 already in use
```bash
# Vite will automatically try the next available port
# Or specify a different port:
npm run dev -- --port 3000
```

**Problem**: API calls failing
- Check that backend is running on port 8080
- Verify CORS configuration in backend
- Check browser console for error messages

**Problem**: Theme not persisting
- Clear browser localStorage
- Check browser console for errors
- Ensure ThemeContext is properly wrapping the app

### Common Issues

**Problem**: Auto-fill not working in forms
- Ensure you're logged in with Google OAuth
- Check that user data is stored in localStorage
- Verify user object has `name` and `email` fields

**Problem**: Admin features not visible
- Check user role in MongoDB: `db.users.find({ email: "your-email" })`
- Ensure role is exactly "ADMIN" (case-sensitive)
- Clear browser cache and re-login

**Problem**: PDF generation failing
- Check server logs for detailed error messages
- Ensure iText dependency is properly loaded
- Verify sufficient disk space for temporary files

---

## API Endpoints Reference

### Public Endpoints
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/lost` - Get all lost items
- `GET /api/found` - Get all found items
- `GET /api/lost/search?q={query}` - Search lost items
- `GET /api/found/search?q={query}` - Search found items

### Protected Endpoints (Require JWT)
- `POST /api/lost` - Create lost item
- `POST /api/found` - Create found item
- `GET /api/notifications/{userId}` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read

### Admin Endpoints (Require ADMIN role)
- `GET /api/admin/statistics` - Get overall statistics
- `GET /api/admin/statistics/monthly?year={year}&month={month}` - Monthly stats
- `GET /api/admin/reports/monthly/pdf?year={year}&month={month}` - Generate PDF
- `GET /api/admin/activity` - Get user activity

---

## Environment Variables (Optional)

You can use environment variables instead of hardcoding values:

### Backend (.env or system environment)
```bash
export MONGODB_URI=mongodb://localhost:27017/findx
export JWT_SECRET=your-secret-key
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8080
```

---

## Production Deployment Notes

### Backend
1. Update `application.properties` for production MongoDB
2. Set strong JWT secret
3. Configure production email SMTP
4. Set up reverse proxy (nginx)
5. Use environment variables for secrets
6. Enable HTTPS

### Frontend
1. Build production bundle: `npm run build`
2. Deploy `dist` folder to static hosting (Vercel, Netlify, etc.)
3. Update API URL to production backend
4. Configure environment variables in hosting platform
5. Enable HTTPS

---

## Support

For issues or questions:
1. Check the Implementation Summary (IMPLEMENTATION_SUMMARY.md)
2. Review the Testing Guide (TESTING_GUIDE.md)
3. Check backend logs for detailed error messages
4. Check browser console for frontend errors

---

## License

This project is part of the FindX Lost & Found Management System.

