import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import TravelPlanner from "./pages/TravelPlanner";
import TripHistory from "./pages/TripHistory";
import ProfilePage from "./pages/ProfilePage";

import { Toaster } from "react-hot-toast";

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showSidebar =
    user &&
    ["/dashboard", "/planner", "/history", "/profile"].includes(
      location.pathname
    );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        {showSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              }
            />

            <Route
              path="/register"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <RegisterPage />
                )
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/planner"
              element={
                <ProtectedRoute>
                  <TravelPlanner />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <TripHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
        }}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;