import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import GoingAbroad from './components/GoingAbroad';
import RegistrationForm from './components/RegistrationForm';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-main-wrapper">
        {/* Top Navigation Bar */}
        <header className="app-navbar">
          <NavLink to="/" className="brand-logo">
            🇱🇰 Adultin<span>LK</span>
          </NavLink>

          <nav className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              end
            >
              ✈️ Services
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              📝 Register
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              📊 My Dashboard
            </NavLink>
          </nav>
        </header>

        {/* Page Content Body & Routing */}
        <main className="app-content-body">
          <Routes>
            <Route path="/" element={<GoingAbroad />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;