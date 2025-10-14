# FindX - Lost & Found Platform

A modern, community-driven lost and found platform built with React (Vite) frontend and Spring Boot backend.

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI**: Light gradient theme with Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Skeleton Loading**: Shimmer animations for better UX
- **Page Transitions**: Smooth Framer Motion animations
- **Search & Filter**: Real-time search with backend integration
- **Contact Flow**: Copy-to-clipboard functionality for phone/email
- **Drag & Drop**: Image upload with progress indicators
- **Toast Notifications**: User feedback for all actions

### Backend (Spring Boot + MongoDB)
- **RESTful API**: Clean endpoints for all operations
- **User Authentication**: JWT-based security with Google OAuth
- **File Upload**: Image handling for lost/found items
- **Search Functionality**: Text-based search across items
- **Contact System**: Message handling between users
- **Matching Logic**: Simple text-based item matching
- **CORS Support**: Configured for localhost development

## 🛠️ Tech Stack

### Frontend
- React 19.1.1
- Vite 6.3.5
- Tailwind CSS 3.x
- Framer Motion
- React Router DOM
- React Icons
- React Toastify
- Axios

### Backend
- Spring Boot 3.x
- MongoDB
- Spring Security
- JWT Authentication
- Google OAuth 2.0
- Maven

## 📋 Prerequisites

- Node.js 18+ and npm
- Java 17+
- MongoDB
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Find_X
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies (if needed)
# Maven will handle dependencies automatically

# Start MongoDB (make sure it's running on localhost:27017)
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Run the Spring Boot application
./mvnw spring-boot:run
# Or on Windows: mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Backend Configuration
Update `backend/src/main/resources/application.properties`:

```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/findx

# Google OAuth (update with your credentials)
google.oauth.client-id=your-google-client-id

# JWT Secret (change in production)
jwt.secret=your-secret-key-32-bytes-minimum
```

### Frontend Configuration
Update `frontend/src/main.jsx` with your Google OAuth client ID:

```javascript
<GoogleOAuthProvider clientId="your-google-client-id">
```

## 🧪 Testing

### Manual Testing Steps

1. **Authentication Flow**
   - Visit `http://localhost:5173`
   - Click "Login" and authenticate with Google
   - Verify user avatar appears in navbar

2. **Lost Items Page**
   - Navigate to `/lost`
   - Verify skeleton loading appears initially
   - Test search functionality
   - Click on an item to view details modal

3. **Found Items Page**
   - Navigate to `/found`
   - Test search and filtering
   - Verify responsive grid layout

4. **Report Forms**
   - Navigate to `/report-lost` or `/report-found`
   - Test drag & drop image upload
   - Verify form validation
   - Submit form and check success message

5. **Contact Flow**
   - Click on any item to open details modal
   - Test copy-to-clipboard for phone/email
   - Send a test message through contact form

6. **Search & Navigation**
   - Test search across lost and found items
   - Verify page transitions are smooth
   - Test mobile responsive design

### API Endpoints

#### Authentication
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

#### Items
- `GET /api/lost` - Get all lost items
- `GET /api/found` - Get all found items
- `GET /api/lost/search?q=query` - Search lost items
- `GET /api/found/search?q=query` - Search found items
- `GET /api/items/search?q=query&type=lost|found` - General search
- `GET /api/lost/{id}` - Get lost item details
- `GET /api/found/{id}` - Get found item details
- `POST /api/lost` - Create lost item
- `POST /api/found` - Create found item

#### Contact
- `POST /api/contact` - Send contact message

## 🎨 Design System

### Colors
- **Primary**: #2563eb (Blue)
- **Accent**: #60a5fa (Light Blue)
- **Muted**: #f1f5f9 (Light Gray)

### Components
- **Buttons**: Rounded-2xl with hover animations
- **Cards**: Subtle shadows with hover effects
- **Forms**: Clean inputs with focus states
- **Modals**: Smooth animations with backdrop

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- JWT token authentication
- CORS configuration for localhost
- Input validation on forms
- Secure file upload handling

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Configure MongoDB Atlas for production
# Update application.properties with production values
# Deploy using your preferred platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running on localhost:27017
   - Check if the database 'findx' exists

2. **CORS Errors**
   - Verify backend is running on port 8080
   - Check CORS configuration in CorsConfig.java

3. **Google OAuth Issues**
   - Verify client ID is correct
   - Check authorized redirect URIs in Google Console

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

### Support

For issues and questions:
- Check the GitHub issues page
- Review the troubleshooting section
- Contact the development team

---

**Happy Coding! 🎉**


//initial 