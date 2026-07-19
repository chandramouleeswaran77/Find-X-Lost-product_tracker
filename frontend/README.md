# 💻 FindX Frontend Client

Welcome to the frontend codebase for FindX, built with **React 19**, **Vite**, and **Tailwind CSS**. This client communicates with the Spring Boot backend REST API to provide a smooth, responsive, and animated user interface for reporting, searching, and managing lost and found items.

---

## 🛠️ Technology Stack & Libraries
*   **Core**: React 19.1.1 (latest features) & Vite 6.3.5 (ultra-fast build tool).
*   **Styling**: Tailwind CSS v3.x (utility-first styling framework).
*   **Routing**: React Router DOM (client-side route management and guarding).
*   **Animations**: Framer Motion (smooth page transitions, modal popups, and micro-interactions).
*   **HTTP Client**: Axios (configured with interceptors to automatically append JWT bearer tokens).
*   **Authentication**: Google OAuth Provider (credential login flow).
*   **Utilities**: React Icons (scalable iconography) & React Toastify (beautiful notification toasts).

---

## 📂 Folder Structure
The directory structure under `frontend/src/` is organized logically as follows:
```
src/
├── assets/             # Global static resources (images, icons)
├── components/         # Reusable presentation and layout components
│   ├── navbar/         # Navigation bar with theme toggle, login, notifications bell
│   ├── report-lost-form/ # Multi-field forms for lost reports (drag & drop uploads)
│   ├── ui/             # Core UI components (buttons, modals, skeletons)
│   └── footer/         # Page footer
├── context/            # React Context Providers
│   ├── AuthContext.jsx # Global user session management (JWT / Google Profile)
│   └── ThemeContext.jsx# Dark/Light mode status and class list controls
├── pages/              # View pages linked via Router
│   ├── Home.jsx        # Landing page with summary metrics & recent reports
│   ├── LostItems.jsx   # List of lost items with debounced search & status filtering
│   ├── FoundItems.jsx  # List of found items with debounced search & status filtering
│   ├── AdminDashboard.jsx # Administration page (delete/resolve items, download PDF)
│   └── Login.jsx       # Google login gateway
├── services/           # Api integration
│   └── api.js          # Axios configuration and backend communication methods
├── App.jsx             # Route definitions and layout provider wrapping
└── main.jsx            # React root DOM rendering and Google OAuth setup
```

---

## 💡 Key Architectural Details

### 1. Global Context Providers
*   **AuthContext**: Manages login, logout, and token session persistence. Reads JWT credentials from `localStorage` upon page load, maintaining a unified state across all subcomponents.
*   **ThemeContext**: Toggles between dark and light themes. Adds or removes the `.dark` class on the `<html>` element and persists preference in `localStorage`.

### 2. Axios Request Interceptor
To authenticate requests automatically, Axios is configured with an request interceptor:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
```

### 3. Smooth Page Transitions & Micro-Animations
We utilize **Framer Motion** to ensure the app doesn't feel static:
*   *Page Wrapper*: Every main page is wrapped in an `<motion.div>` that fades and slides into position when routing changes.
*   *Modal Overlays*: Modals scale up smoothly from the center while the backdrop fades in, mimicking native mobile app experiences.
*   *Hover Effects*: Buttons scale up slightly (`whileHover={{ scale: 1.02 }}`) and cards lift on hover to signal interactivity.

---

## 🚀 Getting Started

### Installation
Make sure you have Node.js 18+ installed.
```bash
cd frontend
npm install
```

### Configuration
Update the Google OAuth Client ID in `src/main.jsx` to match your Google Developer Console credentials:
```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="your-google-client-id">
    <App />
  </GoogleOAuthProvider>
);
```

### Run Locally
```bash
npm run dev
```
The development server will launch at [http://localhost:5173](http://localhost:5173).

### Production Build
To compile the files for production distribution:
```bash
npm run build
```
This generates optimized HTML, CSS, and JS assets in the `dist/` directory, ready to be deployed on static hosts like Netlify or Vercel.
