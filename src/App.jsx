import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Background from './components/Background';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import AvatarPage from './pages/AvatarPage';
import Toast from './components/Toast';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WatchlistProvider>
            <ToastProvider>
              {/* Animated cinematic background — shown on every page */}
              <Background />
              <Toast />
              <Routes>
                <Route path="/" element={<Navigate to="/auth" replace />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/home" element={
                  <ProtectedRoute><HomePage /></ProtectedRoute>
                } />
                <Route path="/movie/:title" element={
                  <ProtectedRoute><MovieDetailPage /></ProtectedRoute>
                } />
                <Route path="/watchlist" element={
                  <ProtectedRoute><WatchlistPage /></ProtectedRoute>
                } />
                <Route path="/avatar" element={
                  <ProtectedRoute><AvatarPage /></ProtectedRoute>
                } />
              </Routes>
            </ToastProvider>
          </WatchlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}