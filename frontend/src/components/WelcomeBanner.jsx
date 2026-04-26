import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import './WelcomeBanner.css'

const WelcomeBanner = () => {
  return (
    <div className="welcome-banner">
      <div className="banner-content">
        <div className="banner-left">
          <h1 className="banner-title">Welcome to VoterEdge AI</h1>
          <p className="banner-subtitle">
            Your step-by-step guide to become a confident voter.
          </p>
          <Link to="/registration" className="banner-button">
            Start My Voting Journey
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="banner-right">
          <div className="banner-illustration">
            <div className="illus-card">
              <div className="illus-check">✓</div>
              <span>Registration</span>
            </div>
            <div className="illus-card accent">
              <div className="illus-check">🗳️</div>
              <span>Ready to Vote</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeBanner
