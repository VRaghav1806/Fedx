import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Settings, LogOut, User as UserIcon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CaseManagement from './pages/CaseManagement';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { authService } from './services/api';
import './styles/design-tokens.css';
import './styles/Sidebar.css';

const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/cases', name: 'Cases', icon: Briefcase },
    { path: '/settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="sidebar glass-card">
      <div className="logo">
        <div className="logo-icon">F</div>
        <span>DCA Platform</span>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-info-brief">
            <div className="user-avatar">
              <UserIcon size={16} />
            </div>
            <div className="user-details">
              <p className="user-name">{user.name}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) return <div className="loading-screen">Verifying session...</div>;

  return (
    <Router>
      <div className="app-layout">
        {user && <Sidebar user={user} onLogout={handleLogout} />}
        <div className={user ? "content-area" : "auth-content-area"}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup setUser={setUser} /> : <Navigate to="/" />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute user={user}><Dashboard /></ProtectedRoute>
            } />
            <Route path="/cases" element={
              <ProtectedRoute user={user}><CaseManagement /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute user={user}><SettingsPage /></ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
