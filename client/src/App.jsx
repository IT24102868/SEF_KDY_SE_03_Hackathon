import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Home from './components/Home';
import RegistrationForm from './components/RegistrationForm';
import ServiceDetails from './components/ServiceDetails';
import Dashboard from './components/Dashboard';
import GoingAbroad from './components/GoingAbroad';
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
              🏠 Home
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              📝 Register
            </NavLink>
            <NavLink
              to="/service-details"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              📄 Service Details
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            >
              📊 Dashboard
            </NavLink>
          </nav>
        </header>

        {/* Sequential Routing */}
        <main className="app-content-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/service-details" element={<ServiceDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<GoingAbroad />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;