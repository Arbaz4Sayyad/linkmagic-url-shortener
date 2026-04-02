import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AnalyticsPage from './pages/AnalyticsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ApiKeyPage from './pages/ApiKeyPage';
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import ScrollToHash from './components/ScrollToHash';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToHash />
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shorten" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

            {/* Protected Routes */}
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics/:shortCode" 
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/api-keys" 
              element={
                <ProtectedRoute>
                  <ApiKeyPage />
                </ProtectedRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={
              <div className="text-center py-24">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  404 - Page Not Found
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">The link you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
