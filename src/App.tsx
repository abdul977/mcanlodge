import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { UserLoginPage } from './components/auth/UserLoginPage';
import { UserProtectedRoute } from './components/auth/UserProtectedRoute';
import { HomePage } from './components/home/HomePage';
import { UserDashboard } from './components/user/UserDashboard';
import { PublicRegistrationForm } from './components/public/PublicRegistrationForm';
import { RegistrationSuccess } from './components/public/RegistrationSuccess';
import { AdminSetup } from './components/admin/AdminSetup';
import { AuthFix } from './components/admin/AuthFix';
import { auth } from './utils/auth';

// Protected Route wrapper component for admin routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await auth.isAuthenticated();
      setIsAuthenticated(authenticated);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Landing page as homepage */}
      <Route path="/" element={<LandingPage />} />

      {/* Hidden admin login route for security */}
      <Route path="/admin" element={<LoginPage />} />

      {/* Admin setup route */}
      <Route path="/admin/setup" element={<AdminSetup />} />

      {/* Auth fix route */}
      <Route path="/admin/fix-auth" element={<AuthFix />} />

      {/* Protected admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* User authentication routes */}
      <Route path="/user/login" element={<UserLoginPage />} />

      {/* Protected user routes */}
      <Route
        path="/user/dashboard"
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        }
      />

      {/* Public registration routes */}
      <Route path="/register" element={<PublicRegistrationForm />} />
      <Route path="/register/success/:referenceNumber" element={<RegistrationSuccess />} />

      {/* Legacy route redirects */}
      <Route path="/home" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Catch all route - redirect to user login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
