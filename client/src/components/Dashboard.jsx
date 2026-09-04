import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('userProfile');
      if (storedData) {
        setUserProfile(JSON.parse(storedData));
      }
    } catch (err) {
      console.error('Failed to parse userProfile from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClearProfile = () => {
    if (window.confirm('Are you sure you want to reset your registered profile?')) {
      localStorage.removeItem('userProfile');
      setUserProfile(null);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading your AdultinLK dashboard...</p>
        </div>
      </div>
    );
  }

  // If no profile found in localStorage
  if (!userProfile) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-empty">
          <div style={{ fontSize: '3rem' }}>👤</div>
          <h2>No User Profile Found</h2>
          <p>
            You have not completed your registration yet. Register now to set up your personalized Going Abroad journey!
          </p>
          <Link to="/register" className="btn-primary-action">
            Go to Registration Form ➡️
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Header Banner */}
      <header className="dashboard-header">
        <span className="dashboard-badge">Personalized Tracker</span>
        <h1>Welcome back, {userProfile.name}! 👋</h1>
        <p className="dashboard-subtitle">
          Here is the status of your <strong>AdultinLK</strong> Going Abroad preparation.
        </p>
      </header>

      {/* Visual Progress Bar Section */}
      <section className="progress-card">
        <div className="progress-header">
          <h3 className="progress-title">
            <span>🚀</span> Journey Milestone Progress
          </h3>
          <span className="progress-percentage">20% Complete</span>
        </div>

        {/* Visual Progress Bar (Simple Div) */}
        <div className="progress-bar-container" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar-fill"></div>
        </div>

        <p className="progress-milestone-text">
          ✅ <strong>Step 1 of 5 Completed:</strong> Profile & Preferred Service Registered (20% Complete). Next step: Review required documents and book your official appointment.
        </p>
      </section>

      {/* User Summary Card */}
      <section className="summary-card">
        <div className="summary-card-header">
          <h3>📋 Registration Summary</h3>
          <span className="service-highlight-badge">
            🎯 {userProfile.preferredService || 'No Service Selected'}
          </span>
        </div>

        <div className="summary-grid">
          {/* Selected Service */}
          <div className="summary-item">
            <div className="summary-label">Target Service</div>
            <div className="summary-value" style={{ color: '#4f46e5' }}>
              {userProfile.preferredService || 'N/A'}
            </div>
          </div>

          {/* Age */}
          <div className="summary-item">
            <div className="summary-label">Applicant Age</div>
            <div className="summary-value">
              {userProfile.age ? `${userProfile.age} years old` : 'N/A'}
            </div>
          </div>

          {/* NIC Number */}
          <div className="summary-item">
            <div className="summary-label">Sri Lankan NIC</div>
            <div className="summary-value" style={{ fontFamily: 'monospace' }}>
              {userProfile.nic || userProfile.nicNumber || 'N/A'}
            </div>
          </div>

          {/* Gender */}
          <div className="summary-item">
            <div className="summary-label">Gender</div>
            <div className="summary-value">
              {userProfile.gender || 'N/A'}
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        <Link to="/" className="btn-primary-action">
          ✈️ Explore Service Procedures
        </Link>
        <Link to="/register" className="btn-secondary-action">
          ✏️ Edit Profile Info
        </Link>
        <button onClick={handleClearProfile} className="btn-danger-outline">
          🗑️ Clear Profile
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
