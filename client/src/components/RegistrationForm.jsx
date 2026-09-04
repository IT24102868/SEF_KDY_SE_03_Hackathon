import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './RegistrationForm.css';

const RegistrationForm = ({ services: propServices, onRegisterSuccess }) => {
  // Track if user is editing an already existing profile
  const [isEditMode, setIsEditMode] = useState(false);

  // Form input state initialized with existing userProfile from localStorage if available
  const [formData, setFormData] = useState(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        return {
          name: parsed.name || '',
          gender: parsed.gender || '',
          age: parsed.age !== undefined && parsed.age !== null ? String(parsed.age) : '',
          nicNumber: parsed.nic || parsed.nicNumber || '',
          preferredService: parsed.preferredService || '',
        };
      }
    } catch (e) {
      console.error('Error loading initial userProfile from localStorage:', e);
    }
    return {
      name: '',
      gender: '',
      age: '',
      nicNumber: '',
      preferredService: '',
    };
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedUser, setSubmittedUser] = useState(null);

  // Dynamic services list for dropdown
  const [servicesList, setServicesList] = useState(propServices || []);

  useEffect(() => {
    // Check if profile exists to toggle edit mode label
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setIsEditMode(true);
      }
    } catch (e) {
      console.error(e);
    }

    if (propServices && propServices.length > 0) {
      setServicesList(propServices);
    } else {
      // Fallback fetch if services prop not provided directly
      const fetchServicesList = async () => {
        try {
          let res;
          try {
            res = await fetch('http://localhost:5001/api/services/going-abroad');
          } catch {
            res = await fetch('http://localhost:5000/api/services/going-abroad');
          }
          if (res.ok) {
            const data = await res.json();
            setServicesList(data);
          }
        } catch (err) {
          console.error('Error loading services for dropdown:', err);
        }
      };
      fetchServicesList();
    }
  }, [propServices]);

  // Sri Lankan NIC regex: 9 digits + V/X or 12 digits
  const validateNIC = (nic) => {
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    return nicRegex.test(nic.trim());
  };

  // Field validation logic
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters long';
        }
        break;

      case 'gender':
        if (!value) {
          error = 'Please select your gender';
        }
        break;

      case 'age':
        if (!value && value !== 0) {
          error = 'Age is required';
        } else {
          const numAge = Number(value);
          if (isNaN(numAge)) {
            error = 'Age must be a valid number';
          } else if (numAge < 18 || numAge > 60) {
            error = 'Age must be between 18 and 60 only';
          }
        }
        break;

      case 'nicNumber':
        if (!value.trim()) {
          error = 'NIC Number is required';
        } else if (!validateNIC(value)) {
          error = 'Invalid Sri Lankan NIC (Format: 9 digits + V/X e.g. 991234567V, or 12 digits e.g. 199912345678)';
        }
        break;

      case 'preferredService':
        if (!value) {
          error = 'Please select a preferred service';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handle individual input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (isSubmitted) {
      const fieldError = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  // Validate all fields on submit
  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const fieldError = validateField(key, formData[key]);
      if (fieldError) {
        newErrors[key] = fieldError;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const isValid = validateAll();
    if (isValid) {
      // 1. Prepare user profile object (preserving original created date if updating)
      let originalRegisteredAt = new Date().toISOString();
      try {
        const existing = localStorage.getItem('userProfile');
        if (existing) {
          const parsed = JSON.parse(existing);
          if (parsed.registeredAt) originalRegisteredAt = parsed.registeredAt;
        }
      } catch (e) {
        console.error(e);
      }

      const userProfileData = {
        name: formData.name.trim(),
        gender: formData.gender,
        age: Number(formData.age),
        nic: formData.nicNumber.trim(),
        nicNumber: formData.nicNumber.trim(),
        preferredService: formData.preferredService,
        registeredAt: originalRegisteredAt,
        updatedAt: new Date().toISOString(),
      };

      // 2. Save into localStorage under key 'userProfile'
      try {
        localStorage.setItem('userProfile', JSON.stringify(userProfileData));
      } catch (storageError) {
        console.error('Error saving userProfile to localStorage:', storageError);
      }

      // 3. Trigger optional callback
      if (onRegisterSuccess) {
        onRegisterSuccess(userProfileData);
      }

      // 4. Redirect to /dashboard
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-header">
        {isEditMode && (
          <span className="form-header-badge">✏️ Edit Mode</span>
        )}
        <h2>
          {isEditMode ? 'Edit Your AdultinLK Profile' : '📝 AdultinLK User Registration'}
        </h2>
        <p>
          {isEditMode
            ? 'Update the fields you want to change below and save your profile.'
            : 'Register your details to start your Going Abroad journey.'}
        </p>
      </div>

      {submittedUser && (
        <div className="success-alert">
          <div className="success-alert-header">
            <h4>🎉 Profile Saved!</h4>
            <button className="reset-form-btn" onClick={() => setSubmittedUser(null)}>
              Dismiss
            </button>
          </div>
          <p className="success-details">
            Welcome, <strong>{submittedUser.name}</strong>! Your preference for{' '}
            <strong>{submittedUser.preferredService}</strong> has been updated.
          </p>
        </div>
      )}

      <form className="registration-form" onSubmit={handleSubmit} noValidate>
        {/* Name Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-name">
            Full Name <span className="required-asterisk">*</span>
          </label>
          <input
            id="reg-name"
            type="text"
            name="name"
            placeholder="e.g. Kasun Perera"
            className={`form-input ${errors.name ? 'has-error' : ''}`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-message">⚠️ {errors.name}</span>}
        </div>

        {/* Gender & Age Row */}
        <div className="form-row">
          {/* Gender Select Dropdown */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-gender">
              Gender <span className="required-asterisk">*</span>
            </label>
            <select
              id="reg-gender"
              name="gender"
              className={`form-select ${errors.gender ? 'has-error' : ''}`}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="error-message">⚠️ {errors.gender}</span>}
          </div>

          {/* Age Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-age">
              Age (18 - 60) <span className="required-asterisk">*</span>
            </label>
            <input
              id="reg-age"
              type="number"
              name="age"
              min="18"
              max="60"
              placeholder="e.g. 24"
              className={`form-input ${errors.age ? 'has-error' : ''}`}
              value={formData.age}
              onChange={handleChange}
            />
            {errors.age && <span className="error-message">⚠️ {errors.age}</span>}
          </div>
        </div>

        {/* NIC Number Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-nic">
            National Identity Card (NIC) <span className="required-asterisk">*</span>
          </label>
          <input
            id="reg-nic"
            type="text"
            name="nicNumber"
            placeholder="e.g. 991234567V or 199912345678"
            className={`form-input ${errors.nicNumber ? 'has-error' : ''}`}
            value={formData.nicNumber}
            onChange={handleChange}
          />
          <span className="form-help-text">
            Valid format: 9 digits with V/X (old format) or 12 digits (new format).
          </span>
          {errors.nicNumber && <span className="error-message">⚠️ {errors.nicNumber}</span>}
        </div>

        {/* Preferred Service Dropdown */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-service">
            Preferred Service <span className="required-asterisk">*</span>
          </label>
          <select
            id="reg-service"
            name="preferredService"
            className={`form-select ${errors.preferredService ? 'has-error' : ''}`}
            value={formData.preferredService}
            onChange={handleChange}
          >
            <option value="">-- Select Preferred Service --</option>
            {servicesList.map((service) => (
              <option key={service._id || service.title} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.preferredService && (
            <span className="error-message">⚠️ {errors.preferredService}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="form-actions-row">
          <button type="submit" className="submit-btn">
            {isEditMode ? '💾 Save Changes & Return to Dashboard' : 'Complete Registration'}
          </button>
          {isEditMode && (
            <Link to="/dashboard" className="cancel-edit-btn">
              Cancel
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
