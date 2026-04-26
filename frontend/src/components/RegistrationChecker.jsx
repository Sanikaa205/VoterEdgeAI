import React, { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { LogIn, CheckCircle, XCircle, Loader, ExternalLink, FileText, Upload, Search, CreditCard } from 'lucide-react'
import './RegistrationChecker.css'

const RegistrationChecker = ({ onStateChange }) => {
  const { user } = useContext(AppContext)

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    state: ''
  })
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const states = ['Maharashtra', 'Gujarat', 'Karnataka']

  const validate = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().split(/\s+/).length < 2) {
      newErrors.fullName = 'Please enter first and last name'
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }
    if (!formData.state) {
      newErrors.state = 'State is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    // Notify parent about state change
    if (name === 'state' && onStateChange) {
      onStateChange(value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setResult(null)
    setApiError('')

    try {
      const response = await fetch(`${API_URL}/api/registration/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.errors?.[0]?.msg || errData.error || 'Failed to check registration')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error('Registration check error:', err)
      setApiError(err.message || 'Unable to check registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setApiError('')
  }

  const registrationSteps = [
    {
      step: 1,
      icon: <ExternalLink size={20} />,
      title: 'Visit NVSP Portal',
      description: 'Go to voters.eci.gov.in and click on "New Voter Registration"'
    },
    {
      step: 2,
      icon: <FileText size={20} />,
      title: 'Fill Form 6 Online',
      description: 'Enter your personal details, address, and constituency information'
    },
    {
      step: 3,
      icon: <Upload size={20} />,
      title: 'Upload Documents',
      description: 'Upload passport-size photo, age proof (Aadhaar/Birth Certificate), and address proof'
    },
    {
      step: 4,
      icon: <Search size={20} />,
      title: 'Submit & Track',
      description: 'Submit the application and note down the reference number to track status'
    },
    {
      step: 5,
      icon: <CreditCard size={20} />,
      title: 'Receive Voter ID (EPIC)',
      description: 'After verification, your EPIC card will be delivered. You can also download the e-EPIC.'
    }
  ]

  // Not logged in state
  if (!user) {
    return (
      <div className="reg-checker">
        <div className="reg-checker-card login-required">
          <div className="login-icon-wrap">
            <LogIn size={32} />
          </div>
          <h2>Check Your Registration Status</h2>
          <p>Please sign in with Google to check your voter registration status.</p>
          <p className="login-hint">Use the <strong>Sign In</strong> button in the header to continue.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reg-checker">
      <div className="reg-checker-card">
        <div className="reg-checker-header">
          <h2>Check Your Registration Status</h2>
          <p>Enter your details below to verify if you're registered to vote.</p>
        </div>

        {/* Result Display */}
        {result && (
          <div className={`reg-result ${result.isRegistered ? 'success' : 'not-registered'}`}>
            {result.isRegistered ? (
              <>
                <div className="result-header success">
                  <CheckCircle size={28} />
                  <div>
                    <h3>You are Registered! ✅</h3>
                    <p>Your voter registration was found in the electoral roll.</p>
                  </div>
                </div>
                <div className="result-details">
                  <div className="detail-row">
                    <span className="detail-label">Name</span>
                    <span className="detail-value">{result.data?.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">State</span>
                    <span className="detail-value">{result.data?.state}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Status</span>
                    <span className={`status-badge ${result.data?.status}`}>
                      {result.data?.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Voter ID</span>
                    <span className="detail-value voter-id">{result.data?.voterId}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Registered On</span>
                    <span className="detail-value">{result.data?.registrationDate}</span>
                  </div>
                </div>
                <button className="btn-check-again" onClick={handleReset} type="button">
                  Check Another
                </button>
              </>
            ) : (
              <>
                <div className="result-header not-found">
                  <XCircle size={28} />
                  <div>
                    <h3>Not Found in Electoral Roll</h3>
                    <p>No matching registration was found. Follow these steps to register:</p>
                  </div>
                </div>

                <div className="registration-steps">
                  {registrationSteps.map((step) => (
                    <div key={step.step} className="reg-step">
                      <div className="step-number">{step.step}</div>
                      <div className="step-icon">{step.icon}</div>
                      <div className="step-content">
                        <h4>{step.title}</h4>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="helpful-links">
                  <a
                    href="https://voters.eci.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nvsp-link"
                  >
                    <ExternalLink size={16} />
                    Go to NVSP Portal
                  </a>
                  <a
                    href="tel:1950"
                    className="helpline-link"
                  >
                    📞 Call Helpline: 1950
                  </a>
                </div>

                <button className="btn-check-again" onClick={handleReset} type="button">
                  Try Again
                </button>
              </>
            )}
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div className="reg-error" role="alert">
            <p>{apiError}</p>
            <button onClick={() => setApiError('')} type="button">Dismiss</button>
          </div>
        )}

        {/* Registration Form */}
        {!result && (
          <form onSubmit={handleSubmit} className="reg-form" noValidate>
            <div className="form-group">
              <label htmlFor="reg-fullName">Full Name <span className="required">*</span></label>
              <input
                id="reg-fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Arjun Sharma"
                className={errors.fullName ? 'input-error' : ''}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                disabled={loading}
                autoComplete="name"
              />
              {errors.fullName && (
                <span id="fullName-error" className="field-error" role="alert">
                  {errors.fullName}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="reg-dob">Date of Birth <span className="required">*</span></label>
              <input
                id="reg-dob"
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'input-error' : ''}
                aria-invalid={!!errors.dateOfBirth}
                aria-describedby={errors.dateOfBirth ? 'dob-error' : undefined}
                disabled={loading}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dateOfBirth && (
                <span id="dob-error" className="field-error" role="alert">
                  {errors.dateOfBirth}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="reg-state">State <span className="required">*</span></label>
              <select
                id="reg-state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? 'input-error' : ''}
                aria-invalid={!!errors.state}
                aria-describedby={errors.state ? 'state-error' : undefined}
                disabled={loading}
              >
                <option value="">Select your state</option>
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && (
                <span id="state-error" className="field-error" role="alert">
                  {errors.state}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Check Registration</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default RegistrationChecker