import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { ExternalLink, BookOpen, CheckCircle } from 'lucide-react'
import './RegistrationChecker.css'

const RegistrationChecker = ({ onStateChange }) => {
  const navigate = useNavigate()
  const { user } = useContext(AppContext)


  return (
    <div className="reg-checker">
      <div className="reg-checker-card">
        <div className="reg-checker-header">
          <h2>Check Your Registration Status</h2>
        </div>

        <div className="decision-section">
          <div className="helper-text">
            <p>Choose an option to continue your voting journey.</p>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="btn-action secondary"
              onClick={() => window.open('https://electoralsearch.eci.gov.in/', '_blank')}
            >
              <ExternalLink size={18} />
              <span>Check if I am a registered voter</span>
            </button>

            <button
              type="button"
              className="btn-action primary"
              onClick={() => navigate('/candidates')}
            >
              <CheckCircle size={18} />
              <span>I am a verified voter</span>
            </button>

            <button
              type="button"
              className="btn-action ghost"
              onClick={() => navigate('/how-to-vote')}
            >
              <BookOpen size={18} />
              <span>How to become a voter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationChecker