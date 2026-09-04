import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userProfile');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name) {
          setHasProfile(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="home-hero-container">
      {/* Header Badge */}
      <div className="home-badge">
        <span>🇱🇰</span> Sri Lanka's Essential Public Service Navigator
      </div>

      {/* Main Tagline */}
      <h1 className="home-tagline">
        Life happens. <span>We've got the paperwork.</span>
      </h1>

      {/* Site Description */}
      <p className="home-description">
        Adulting in Sri Lanka shouldn't be a maze of confusing paperwork and long government queues.
        AdultinLK guides you step-by-step through official Passport applications, Student & Work Visas,
        and Police Clearance Certificates with clear document checklists and official portals.
      </p>

      {/* Action Buttons */}
      <div className="home-cta-group">
        <Link to="/register" className="btn-get-started">
          {hasProfile ? 'Update / View Profile ✏️' : 'Get Started 🚀'}
        </Link>
        {hasProfile ? (
          <Link to="/service-details" className="btn-explore-outline">
            View My Service Guide 📄
          </Link>
        ) : (
          <Link to="/services" className="btn-explore-outline">
            Browse All Services ✈️
          </Link>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="home-features-grid">
        <div className="feature-box">
          <span className="feature-icon">🛂</span>
          <h3>Sri Lankan Passports</h3>
          <p>
            Online appointment booking, photo studio receipt verification, and Battaramulla Immigration submission guides.
          </p>
        </div>

        <div className="feature-box">
          <span className="feature-icon">✈️</span>
          <h3>Student & Work Visas</h3>
          <p>
            VFS Global appointment navigation, 28-day financial balance proof, and IOM health screening essentials.
          </p>
        </div>

        <div className="feature-box">
          <span className="feature-icon">📜</span>
          <h3>Police Clearance (PCC)</h3>
          <p>
            Online e-Services portal application, residential history submission, and verified foreign embassy dispatch tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
