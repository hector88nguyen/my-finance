import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Reports from './pages/Reports';
import More from './pages/More';
import Layout from './components/Layout';

const ProtectedRoute = ({ user, loading, children }) => {
  if (loading) {
    return <div className="loading-screen">Đang tải...</div>;
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
    return <div className="loading-screen">Đang tải ứng dụng...</div>;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />

        <Route path="/" element={<ProtectedRoute user={user} loading={loading}><Dashboard user={user} /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute user={user} loading={loading}><Accounts user={user} /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute user={user} loading={loading}><Transactions user={user} /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute user={user} loading={loading}><Reports user={user} /></ProtectedRoute>} />
        <Route path="/more" element={<ProtectedRoute user={user} loading={loading}><More user={user} /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App;
