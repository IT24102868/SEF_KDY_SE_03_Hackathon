import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './ServiceDetails.css';

const ServiceDetails = () => {
  const [service, setService] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(null); // null = checking, false = blocked, true = valid
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Strict Profile Guard: Check for userProfile in localStorage
    let storedProfile = null;
    let storedServiceId = null;

    try {
      const profileStr = localStorage.getItem('userProfile');
      storedServiceId = localStorage.getItem('selectedServiceId');

      if (profileStr) {
        const parsed = JSON.parse(profileStr);
        // Verify profile has at least a valid name and either a selectedServiceId or preferredService
        if (parsed && parsed.name && parsed.name.trim().length > 0) {
          storedProfile = parsed;
          setUserProfile(parsed);
          setHasProfile(true);

          if (!storedServiceId && parsed.selectedServiceId) {
            storedServiceId = parsed.selectedServiceId;
          }
        } else {
          setHasProfile(false);
          setLoading(false);
          return;
        }
      } else {
        // No profile in localStorage - access is blocked
        setHasProfile(false);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error('Error validating user profile from localStorage:', e);
      setHasProfile(false);
      setLoading(false);
      return;
    }

    // 2. Fetch services from backend and filter by user's selected service
    const fetchServiceDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        let response;
        try {
          response = await fetch('http://localhost:5001/api/services/going-abroad');
        } catch {
          response = await fetch('http://localhost:5000/api/services/going-abroad');
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch services (Status: ${response.status})`);
        }

        const allServices = await response.json();

        // Match service strictly by selectedServiceId or preferredService title
        let matchedService = null;
        if (storedServiceId) {
          matchedService = allServices.find((s) => s._id === storedServiceId);
        }

        if (!matchedService && storedProfile && storedProfile.preferredService) {
          matchedService = allServices.find((s) => s.title === storedProfile.preferredService);
        }

        if (matchedService) {
          setService(matchedService);
        } else {
          setError('No service matched your registration. Please select a service.');
        }
      } catch (err) {
        console.error('Error loading service details:', err);
        setError(err.message || 'Unable to connect to AdultinLK backend');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, []);

  // Loading state
  if (loading || hasProfile === null) {
    return (
      <div className="service-details-container">
        <div className="sd-state-box">
          <p>Verifying profile & loading service details...</p>
        </div>
      </div>
    );
  }

  // Strict Access Control: If user has no profile, prevent viewing service details
  if (hasProfile === false) {
    return (
      <div className="service-details-container">
        <div className="sd-state-box">
          <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>🔒</div>
          <h2>Registration Profile Required</h2>
          <p style={{ maxWidth: '520px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
            Service procedures, required document checklists, and submission timelines are restricted to registered users.
            Please complete the quick registration form first to personalize your going-abroad roadmap.
          </p>
          <div className="sd-actions-row" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn-back-dashboard">
              📝 Register Profile to Unlock
            </Link>
            <Link to="/" className="btn-change-service">
              🏠 Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error or unmatched service
  if (error || !service) {
    return (
      <div className="service-details-container">
        <div className="sd-state-box">
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h2>Service Selection Incomplete</h2>
          <p>{error || 'Please choose a target service to view its detailed documentation guide.'}</p>
          <div className="sd-actions-row" style={{ justifyContent: 'center' }}>
            <Link to="/register" className="btn-back-dashboard">
              ✏️ Select Target Service
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-details-container">
      {/* Personalized User Greeting Header */}
      {userProfile && (
        <div className="sd-user-banner">
          <div className="sd-user-info">
            <h3>👤 Personalized Guide for {userProfile.name}</h3>
            <p>
              NIC: <code>{userProfile.nic || userProfile.nicNumber}</code> | Age: {userProfile.age} | Target:{' '}
              <strong>{service.title}</strong>
            </p>
          </div>
          <Link to="/register" className="sd-edit-profile-link">
            ✏️ Change Preference
          </Link>
        </div>
      )}

      {/* Service Header Card */}
      <header className="sd-header-card">
        <span className="sd-badge">Official Step-by-Step Procedure</span>
        <h1>{service.title}</h1>
        <p className="sd-description">{service.description}</p>
      </header>

      {/* Detailed Procedure Steps & Required Documents Grid */}
      <div className="sd-content-grid">
        {/* Step-by-Step Timeline */}
        <section className="sd-section-card">
          <h2 className="sd-section-title">
            <span>📋</span> Step-by-Step Procedure
          </h2>
          {service.steps && service.steps.length > 0 ? (
            <ol className="sd-steps-timeline">
              {service.steps.map((step, idx) => (
                <li key={idx} className="sd-step-item">
                  <span className="sd-step-number">{idx + 1}</span>
                  <span className="sd-step-text">{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p style={{ color: '#94a3b8' }}>No procedure steps listed.</p>
          )}
        </section>

        {/* Required Documents Checklist */}
        <section className="sd-section-card">
          <h2 className="sd-section-title">
            <span>📁</span> Required Documents Checklist
          </h2>
          {service.requiredDocuments && service.requiredDocuments.length > 0 ? (
            <ul className="sd-docs-list">
              {service.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="sd-doc-item">
                  <span className="sd-doc-icon">✓</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#94a3b8' }}>No specific documents listed.</p>
          )}
        </section>
      </div>

      {/* Official Government Source Portal */}
      {service.officialSource && (
        <div className="sd-portal-box">
          <div className="sd-portal-info">
            <h4>Official Government Web Portal</h4>
            <p>Access authorized application submissions and online appointment bookings directly.</p>
          </div>
          <a
            href={service.officialSource}
            target="_blank"
            rel="noopener noreferrer"
            className="sd-portal-button"
          >
            <span>🔗</span> Open {service.officialSource.replace(/^https?:\/\//, '')} ↗
          </a>
        </div>
      )}

      {/* Action Buttons */}
      <div className="sd-actions-row">
        <Link to="/dashboard" className="btn-back-dashboard">
          📊 Back to Dashboard
        </Link>
        <Link to="/register" className="btn-change-service">
          🔄 Select Different Service
        </Link>
        <Link to="/" className="btn-change-service">
          🏠 Home
        </Link>
      </div>
    </div>
  );
};

export default ServiceDetails;
