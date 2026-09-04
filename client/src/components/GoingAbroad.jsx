import React, { useState, useEffect } from 'react';
import './GoingAbroad.css';

const GoingAbroad = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local state to track which service IDs are added to "My Journey"
  const [journeyItems, setJourneyItems] = useState([]);

  // Local state for real-time search/filter by title
  const [searchTerm, setSearchTerm] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      // Support port 5001 (macOS AirPlay safe) and port 5000
      let response;
      try {
        response = await fetch('http://localhost:5001/api/services/going-abroad');
      } catch {
        response = await fetch('http://localhost:5000/api/services/going-abroad');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch services (Status: ${response.status})`);
      }

      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error('Error fetching going-abroad services:', err);
      setError(err.message || 'Unable to connect to AdultinLK backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Toggle service selection in "My Journey"
  const handleToggleJourney = (serviceId) => {
    setJourneyItems((prevItems) => {
      if (prevItems.includes(serviceId)) {
        return prevItems.filter((id) => id !== serviceId);
      } else {
        return [...prevItems, serviceId];
      }
    });
  };

  if (loading) {
    return (
      <div className="going-abroad-container">
        <div className="state-container">
          <div className="spinner"></div>
          <h3>Loading AdultinLK Going Abroad Services...</h3>
          <p style={{ color: '#64748b' }}>Fetching official procedures & requirements</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="going-abroad-container">
        <div className="state-container">
          <div className="error-title">⚠️ Failed to Load Services</div>
          <p style={{ color: '#64748b' }}>{error}</p>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '0.5rem' }}>
            Ensure your backend server is running at <code>http://localhost:5001</code>
          </p>
          <button className="retry-button" onClick={fetchServices}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Selected services for journey summary display
  const selectedServices = services.filter((s) => journeyItems.includes(s._id));

  // Real-time title filter logic
  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="going-abroad-container">
      {/* Header */}
      <header className="ga-header">
        <span className="ga-badge">AdultinLK Guidance Module</span>
        <h1>Going Abroad Navigator ✈️</h1>
        <p className="ga-subtitle">
          Essential Sri Lankan public and international service guides for passports, visas, and clearances.
          Select items below to personalize your journey checklist.
        </p>
      </header>

      {/* Journey Progress Summary */}
      <div className={`journey-summary-panel ${journeyItems.length > 0 ? 'active' : ''}`}>
        <div className="journey-summary-info">
          <h3>
            🧳 My Journey Checklist ({journeyItems.length} of {services.length} Added)
          </h3>
          <p>
            {journeyItems.length === 0
              ? 'Click the checkbox on any service card to build your personalized going-abroad roadmap.'
              : 'You have actively tracked the following services in your journey:'}
          </p>
        </div>

        {selectedServices.length > 0 && (
          <div className="journey-tags">
            {selectedServices.map((item) => (
              <span key={item._id} className="journey-tag">
                ✓ {item.title}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Search / Filter Input */}
      <div className="ga-search-container">
        <div className="ga-search-input-wrapper">
          <span className="ga-search-icon">🔍</span>
          <input
            type="text"
            className="ga-search-input"
            placeholder="Search services by title (e.g. Passport, Visa, Police Clearance)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="ga-search-clear"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <div className="ga-results-count">
          Showing {filteredServices.length} of {services.length} services
        </div>
      </div>

      {/* Services Cards List */}
      <div className="services-grid">
        {filteredServices.length === 0 ? (
          <div className="no-results-container">
            <h4>No services found matching "{searchTerm}"</h4>
            <p>Try searching with a different title or keyword.</p>
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              Clear Filter
            </button>
          </div>
        ) : (
          filteredServices.map((service) => {
            const isAdded = journeyItems.includes(service._id);

            return (
              <div
                key={service._id}
                className={`service-card ${isAdded ? 'selected' : ''}`}
              >
                {/* Card Top Row */}
                <div className="card-header-row">
                  <div className="card-title-group">
                    <h2 className="card-title">{service.title}</h2>
                    <p className="card-description">{service.description}</p>
                  </div>

                  {/* Checkbox: Add to My Journey */}
                  <div className="journey-toggle-container">
                    <label
                      htmlFor={`journey-check-${service._id}`}
                      className={`journey-checkbox-label ${isAdded ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        id={`journey-check-${service._id}`}
                        className="journey-checkbox"
                        checked={isAdded}
                        onChange={() => handleToggleJourney(service._id)}
                      />
                      <span>{isAdded ? 'In My Journey' : 'Add to My Journey'}</span>
                    </label>
                  </div>
                </div>

                {/* Card Content: Steps & Required Documents */}
                <div className="card-body-grid">
                  {/* Steps Section */}
                  <div className="card-section">
                    <h4 className="section-subtitle">
                      <span>📋</span> Procedure & Steps
                    </h4>
                    {service.steps && service.steps.length > 0 ? (
                      <ol className="steps-list">
                        {service.steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    ) : (
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No steps specified.</p>
                    )}
                  </div>

                  {/* Required Documents Section */}
                  <div className="card-section">
                    <h4 className="section-subtitle">
                      <span>📁</span> Required Documents
                    </h4>
                    {service.requiredDocuments && service.requiredDocuments.length > 0 ? (
                      <ul className="docs-list">
                        {service.requiredDocuments.map((doc, idx) => (
                          <li key={idx}>
                            <span className="doc-bullet">•</span>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No documents required.</p>
                    )}
                  </div>
                </div>

                {/* Card Footer: Official Source & Status */}
                <div className="card-footer">
                  {service.officialSource && (
                    <a
                      href={service.officialSource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="official-source-link"
                    >
                      <span>🔗</span> Official Source Portal: {service.officialSource.replace(/^https?:\/\//, '')} ↗
                    </a>
                  )}

                  <div className={`status-indicator ${isAdded ? 'added' : 'not-added'}`}>
                    {isAdded ? '✅ Added to Journey Tracker' : '⚪ Not in your journey'}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GoingAbroad;
