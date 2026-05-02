import { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Accounts = lazy(() => import('./pages/Accounts'));
const Reports = lazy(() => import('./pages/Reports'));
const More = lazy(() => import('./pages/More'));

const ProtectedRoute = ({ user, loading, children }) => {
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout user={user}>{children}</Layout>;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <ErrorBoundary>
          <HashRouter>
            <Suspense fallback={<LoadingSpinner fullScreen />}>
              <Routes>
                <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

                <Route path="/" element={<ProtectedRoute user={user} loading={loading}><Dashboard user={user} /></ProtectedRoute>} />
                <Route path="/accounts" element={<ProtectedRoute user={user} loading={loading}><Accounts user={user} /></ProtectedRoute>} />
                <Route path="/transactions" element={<ProtectedRoute user={user} loading={loading}><Transactions user={user} /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute user={user} loading={loading}><Reports user={user} /></ProtectedRoute>} />
                <Route path="/more" element={<ProtectedRoute user={user} loading={loading}><More user={user} /></ProtectedRoute>} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </HashRouter>
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App;
