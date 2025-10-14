import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import Login from './components/login/Login.jsx';
import HomePage from './components/home/HomePage.jsx';
import LostPage from './components/lostpage/LostPage.jsx';
import ReportLostPage from './components/report-lost-form/ReportLostForm.jsx';
import ReportFoundForm from './components/report-found-form/ReportFoundForm.jsx';
import FoundPage from './components/found-page/FoundPage.jsx';
import ProfileRouter from './components/profile/ProfileRouter.jsx';
import AdminClaimsPage from './components/admin/AdminClaimsPage.jsx';
import AdminItemsPage from './components/admin/AdminItemsPage.jsx';
import './App.css';

const ProtectedRoute = ({ children }) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    console.error('Invalid user data in localStorage:', err);
  }
  return user ? children : <Navigate to="/" />;
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />
        <Route path="/home" element={
          <PageTransition>
            <HomePage />
          </PageTransition>
        } />
        <Route path="/lost" element={
          <PageTransition>
            <LostPage />
          </PageTransition>
        } />
        <Route path="/report-lost" element={
          <PageTransition>
            <ReportLostPage />
          </PageTransition>
        } />
        <Route path="/found" element={
          <PageTransition>
            <FoundPage />
          </PageTransition>
        } />
        <Route path="/report-found" element={
          <PageTransition>
            <ReportFoundForm />
          </PageTransition>
        } />
        <Route path="/profile" element={
          <PageTransition>
            <ProfileRouter />
          </PageTransition>
        } />
        <Route path="/admin/claims" element={
          <PageTransition>
            <AdminClaimsPage />
          </PageTransition>
        } />
        <Route path="/admin/items" element={
          <PageTransition>
            <AdminItemsPage />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;