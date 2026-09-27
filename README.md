# 🔍 FindX — Lost & Found Management Platform

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=black&style=flat-square)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot&logoColor=white&style=flat-square)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-database-47A248?logo=mongodb&logoColor=white&style=flat-square)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-black?logo=jsonwebtokens&logoColor=white&style=flat-square)](https://jwt.io/)
[![Google OAuth](https://img.shields.io/badge/Google_OAuth-2.0-4285F4?logo=google&logoColor=white&style=flat-square)](https://developers.google.com/identity/protocols/oauth2)

**FindX** is a modern, responsive, and secure lost-and-found community platform designed to connect people who have lost items with those who have found them. The application uses a Spring Boot REST API for a robust backend and a React (Vite) Single Page Application for a rich, animated frontend, supported by a standalone MongoDB database.

---

## 🏗️ System Architecture

```
                      ┌────────────────────────────────────────┐
                      │            React Client (Vite)         │
                      │  - Google OAuth / JWT Session State    │
                      │  - Framer Motion Layouts & Animations   │
                      │  - Responsive Tailwind CSS (Dark/Light)│
                      └───────────────────┬────────────────────┘
                                          │
                        REST API Requests │ JWT Authorization Header
                        (Axios Interceptor)│
                                          ▼
                      ┌────────────────────────────────────────┐
                      │          Spring Boot Backend           │
                      │  - JWT & Google Token Validation       │
                      │  - File Upload Handler (uploads/)       │
                      │  - Notification & Search Services      │
                      │  - Monthly PDF Reporting (OpenPDF)     │
                      └───────────────────┬────────────────────┘
                                          │
                        Database Queries  │
                        (Spring Data)     │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │            MongoDB Database            │
                      │  Collections: users, lost_items,       │
                      │  found_items, notifications, contact   │
                      └────────────────────────────────────────┘
```

---

## 💡 Key Features

### 💻 React Frontend
*   **Dual Theme Support**: Beautiful dark and light modes with seamless global class toggling and persistent browser-state retention.
*   **Aesthetic User Interface**: Sleek gradient backdrops, interactive cards, micro-animations using **Framer Motion**, and skeleton loading state shimmers to ensure optimal UX.
*   **Image Management**: Dynamic drag-and-drop file upload zone showing live progress feedback.
*   **Contextual Modals**: Detailed item overlays featuring one-click contact details copying and direct message submission forms.

### ⚙️ Spring Boot Backend
*   **Automated Match Engine**: Scans item titles and descriptions dynamically to find keyword overlaps and notify users immediately.
*   **Role-Based Access Control**: Standard users manage their listings and notifications, while Administrators gain access to a dedicated dashboard to perform CRUD actions on all items and generate PDF analytics reports.
*   **Secure Authentication**: JWT-based session security integrated with Google OAuth for single sign-on.
*   **Static Resource Serving**: Safe and reliable local image saving and resource routing, resolving full URLs for cross-origin frontend consumption.

---

## 🧪 Deep-Dive: Core Technical Showcases

### 1. The Keyword Matching Algorithm
To avoid simple, rigid database queries, FindX incorporates a custom matching algorithm that runs whenever a new lost or found item is reported:
*   **Tokenization & Normalization**: The title and description of the new item are converted to lowercase, stripped of special characters, and split into individual keywords.
*   **Stop-word Filtering**: Common filler words (e.g., *the*, *a*, *with*, *for*) are removed to extract core tokens.
*   **Similarity Matching Rules**: The system queries existing database records and checks for matches:
    *   *Exact Matches*: The system looks for direct overlaps between item names.
    *   *Partial/Fuzzy Matches*: Evaluates partial keyword overlaps (e.g., "AirPods Pro" matches "AirPods").
    *   *Synonym Handling*: Handles standard equivalents (e.g., mapping `phone` ↔ `mobile` and `pods` ↔ `airpods`).
*   **Bi-directional Notification**: Once a match is confirmed, the status of both items is updated to `POSSIBLE_MATCH`, and persistent in-app notifications are written to the database for **both** the owner and the finder.

### 2. Spring Security & JWT Token Verification
Secure endpoints are guarded using a custom security filter chain:
1.  **Google OAuth Sign-In**: The React client obtains an authorization token from Google and sends it to the backend (`POST /api/auth/google`).
2.  **JWT Token Generation**: The backend validates the Google token. Upon success, it fetches/registers the user record in MongoDB and issues a signed JWT token containing the user's ID, email, and roles.
3.  **Request Authentication**: Submitting forms, updating items, or viewing notifications requires the React client to pass the JWT in the `Authorization: Bearer <token>` header. A `JwtAuthenticationFilter` intercepts the request, verifies the signature, and populates the Spring Security Context.

### 3. Static Media Streaming Configuration
FindX serves uploaded images locally. The backend maps filesystem paths to public HTTP endpoints:
*   **Storage Location**: Uploads are saved inside isolated `uploads/lost/` and `uploads/found/` directories.
*   **Resource Mapping**: A customized `WebMvcConfigurer` configures Spring Boot to serve directories statically:
    ```java
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
    ```
*   **Absolute Paths**: When an item is saved, the backend constructs and stores the absolute URL (`http://localhost:8080/uploads/...`) in MongoDB, ensuring the frontend can load images directly across origins.

### 4. Admin Monthly PDF Report Engine
The system uses the **OpenPDF** library to generate formal summaries for platform administrators:
*   **Metrics Aggregation**: Resolves total user registrations, open reports, resolved cases, and active notifications.
*   **Dynamic PDF Generation**: The `ReportService` writes a styled document on-the-fly, creating title headings, structured tables, and key performance metric grids.
*   **Streamed Responses**: The generated PDF is written directly to the HTTP response stream with `Content-Type: application/pdf`, letting the administrator download or view the report directly in their browser.

---

## 📍 API Reference

### Authentication Endpoints
| HTTP Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/google` | Exchange Google OAuth Token for JWT | No |
| `GET` | `/api/auth/me` | Retrieve profile details of logged-in user | Yes |

### Item Management
| HTTP Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/lost` | Fetch all open lost items | No |
| `GET` | `/api/found` | Fetch all open found items | No |
| `GET` | `/api/lost/{id}` | Retrieve details of a specific lost item | No |
| `GET` | `/api/found/{id}` | Retrieve details of a specific found item | No |
| `POST` | `/api/lost` | File a new lost item report (multipart/form-data) | Yes |
| `POST` | `/api/found` | File a new found item report (multipart/form-data) | Yes |
| `PUT` | `/api/lost/{id}` | Modify a lost item listing (Admin/Owner) | Yes |
| `DELETE` | `/api/lost/{id}` | Permanently delete a lost item listing (Admin/Owner) | Yes |

### Notifications & Communication
| HTTP Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/notifications` | Fetch unread notifications for user | Yes |
| `PUT` | `/api/notifications/{id}/read`| Mark a specific notification as read | Yes |
| `POST` | `/api/contact` | Send a message to an item owner | Yes |

### Administrator Operations
| HTTP Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/admin/stats` | Retrieve platform-wide metrics | Admin Only |
| `GET` | `/api/admin/reports/monthly`| Download the Monthly PDF Report | Admin Only |

---

## 📂 Project Structure

```
Find_X/
├── backend/                  # Spring Boot REST API
│   ├── src/main/java/        # Java Source Files
│   ├── src/main/resources/   # App Configuration & Assets
│   ├── uploads/              # Local uploaded files (Git ignored)
│   ├── pom.xml               # Maven Dependency Management
│   └── mvnw.cmd              # Maven Wrapper
└── frontend/                 # React Single Page App
    ├── src/
    │   ├── components/       # Reusable layout and ui components
    │   ├── pages/            # View Pages (Home, Lost, Found, Admin)
    │   ├── context/          # Global Authentication and Theme contexts
    │   └── main.jsx          # Entry point
    ├── tailwind.config.js    # Styling configurations
    └── vite.config.js        # Vite build configuration
```

---

## 🚀 Installation & Local Run

### Prerequisites
*   [Java Development Kit (JDK) 17+](https://adoptium.net/)
*   [Node.js (v18+) & npm](https://nodejs.org/)
*   [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running on `localhost:27017`)

### 1. Database Setup
Ensure MongoDB is running locally:
```bash
# On Windows (as Administrator)
net start MongoDB
```

### 2. Configure Environment Variables
You can override credentials in `backend/src/main/resources/application.properties` by setting system environment variables:
```bash
# Optional: Setup Google OAuth & Email credentials
set GOOGLE_CLIENT_ID=your_client_id
set SMTP_USERNAME=your_gmail_address
set SMTP_PASSWORD=your_gmail_app_password
set JWT_SECRET=your_custom_secret_key_at_least_32_bytes
```

### 3. Launch Backend Server
```bash
cd backend
# Build the project
.\mvnw.cmd clean compile
# Run the application
.\mvnw.cmd spring-boot:run
```
The backend server will start on [http://localhost:8080](http://localhost:8080).

### 4. Launch Frontend Client
```bash
cd frontend
# Install node dependencies
npm install
# Run the development server
npm run dev
```
The frontend dev server will start on [http://localhost:5173](http://localhost:5173).

---

