import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GET_SERVICES_URL } from '../apiConfig';
import './RegistrationForm.css';

const RegistrationForm = ({ services: propServices, onRegisterSuccess }) => {
  // Dynamic services list for dropdown
  const [servicesList, setServicesList] = useState(propServices || []);
  const [loadingServices, setLoadingServices] = useState(false);

  // Track if user is editing an already existing profile
  const [isEditMode, setIsEditMode] = useState(false);

  // Form input state initialized with existing userProfile from localStorage if available
  const [formData, setFormData] = useState(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const savedServiceId = localStorage.getItem('selectedServiceId');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        return {
          name: parsed.name || '',
          gender: parsed.gender || '',
          age: parsed.age !== undefined && parsed.age !== null ? String(parsed.age) : '',
          nicNumber: parsed.nic || parsed.nicNumber || '',
          selectedServiceId: parsed.selectedServiceId || savedServiceId || '',
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
      selectedServiceId: '',
      preferredService: '',
    };
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch services from backend /api/services/going-abroad
  useEffect(() => {
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
      const fetchServicesList = async () => {
        setLoadingServices(true);
        try {
          let res;
          try {
            res = await fetch(GET_SERVICES_URL);
          } catch {
            res = await fetch('http://localhost:5000/api/services/going-abroad');
          }
          if (res.ok) {
            const data = await res.json();
            setServicesList(data);

            // If user had a selectedServiceId or preferredService, make sure both are synchronized
            setFormData((prev) => {
              if (prev.selectedServiceId && !prev.preferredService) {
                const found = data.find((s) => s._id === prev.selectedServiceId);
                if (found) return { ...prev, preferredService: found.title };
              } else if (!prev.selectedServiceId && prev.preferredService) {
                const found = data.find((s) => s.title === prev.preferredService);
                if (found) return { ...prev, selectedServiceId: found._id };
              }
              return prev;
            });
          }
        } catch (err) {
          console.error('Error loading services for dropdown:', err);
        } finally {
          setLoadingServices(false);
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

      case 'selectedServiceId':
      case 'preferredService':
        if (!formData.selectedServiceId && !value) {
          error = 'Please select a preferred service';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'selectedServiceId') {
      const selectedService = servicesList.find((s) => s._id === value);
      setFormData((prev) => ({
        ...prev,
        selectedServiceId: value,
        preferredService: selectedService ? selectedService.title : '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

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
      // 1. Prepare user profile object
      const userProfileData = {
        name: formData.name.trim(),
        gender: formData.gender,
        age: Number(formData.age),
        nic: formData.nicNumber.trim(),
        nicNumber: formData.nicNumber.trim(),
        selectedServiceId: formData.selectedServiceId,
        preferredService: formData.preferredService,
        updatedAt: new Date().toISOString(),
      };

      // 2. Save User Profile AND selectedServiceId into localStorage
      try {
        localStorage.setItem('userProfile', JSON.stringify(userProfileData));
        if (formData.selectedServiceId) {
          localStorage.setItem('selectedServiceId', formData.selectedServiceId);
        }
      } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
      }

      if (onRegisterSuccess) {
        onRegisterSuccess(userProfileData);
      }

      // 3. Redirect to /service-details as requested
      window.location.href = '/service-details';
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-header">
        {isEditMode && <span className="form-header-badge">✏️ Edit Mode</span>}
        <h2>
          {isEditMode ? 'Edit Your AdultinLK Profile' : '📝 Step 1: User Registration'}
        </h2>
        <p>
          {isEditMode
            ? 'Update the fields you want to change below and view your service details.'
            : 'Fill in your details and pick your target service to get personalized documentation guidance.'}
        </p>
      </div>

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
          {/* Gender Select */}
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

        {/* Preferred Service Dropdown (fetched from /api/services/going-abroad) */}
        <div className="form-group">
          <label className="form-label" htmlFor="reg-service">
            Preferred Service <span className="required-asterisk">*</span>
          </label>
          <select
            id="reg-service"
            name="selectedServiceId"
            className={`form-select ${errors.selectedServiceId ? 'has-error' : ''}`}
            value={formData.selectedServiceId}
            onChange={handleChange}
          >
            <option value="">
              {loadingServices ? 'Loading services from backend...' : '-- Select Target Service --'}
            </option>
            {servicesList.map((service) => (
              <option key={service._id} value={service._id}>
                {service.title}
              </option>
            ))}
          </select>
          {errors.selectedServiceId && (
            <span className="error-message">⚠️ {errors.selectedServiceId}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="form-actions-row">
          <button type="submit" className="submit-btn">
            Proceed to Service Details ➡️
          </button>
          {isEditMode && (
            <Link to="/service-details" className="cancel-edit-btn">
              Cancel
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
