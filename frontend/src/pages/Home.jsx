import React, { useState, useEffect } from 'react'
import { Clock, Shield, Globe, Lock, CheckCircle } from 'lucide-react'
import WelcomeBanner from '../components/WelcomeBanner'
import JourneyTracker from '../components/JourneyTracker'
import ActionCard from '../components/ActionCard'
import './Home.css'

const Home = () => {
  const [showChecklist, setShowChecklist] = useState(false)
  const [checklistItems, setChecklistItems] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false,
    check5: false,
    check6: false,
    check7: false,
    check8: false,
  })

  // Load checklist from localStorage on mount
  useEffect(() => {
    const savedChecklist = localStorage.getItem('electionDayChecklist')
    if (savedChecklist) {
      try {
        setChecklistItems(JSON.parse(savedChecklist))
      } catch (error) {
        console.error('Error loading checklist:', error)
      }
    }
  }, [])

  // Save checklist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('electionDayChecklist', JSON.stringify(checklistItems))
  }, [checklistItems])

  const handleChecklistChange = (e) => {
    const { id, checked } = e.target
    setChecklistItems((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  const completedCount = Object.values(checklistItems).filter(Boolean).length
  const totalCount = Object.keys(checklistItems).length
  const allCompleted = completedCount === totalCount

  const highlights = [
    {
      id: 1,
      icon: <Clock size={28} />,
      title: 'Smart Timeline',
      description: 'Get important dates and deadlines for your area.',
    },
    {
      id: 2,
      icon: <Shield size={28} />,
      title: 'Neutral & Fair',
      description: 'We provide unbiased information only.',
    },
    {
      id: 3,
      icon: <Globe size={28} />,
      title: 'Multi-language Support',
      description: 'Available in multiple languages.',
    },
    {
      id: 4,
      icon: <Lock size={28} />,
      title: 'Your Privacy Matters',
      description: 'We respect your data and keep it secure.',
    },
  ]

  return (
    <div className="home-page">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Journey Tracker */}
      <JourneyTracker />

      {/* Action Cards Grid */}
      <section className="action-cards-section">
        <h2 className="section-title">Get Started</h2>
        <div className="action-cards-grid">
          <ActionCard
            icon="✓"
            title="1. Registration Check"
            description="Check if your name is on the voter list and get registered."
            buttonText="Check Now"
            accentColor="blue"
            to="/registration"
          />
          <ActionCard
            icon="👥"
            title="2. Know Your Candidates"
            description="See who is contesting in your area and what they stand for."
            buttonText="View Candidates"
            accentColor="purple"
            to="/candidates"
          />
          <ActionCard
            icon="📍"
            title="3. Polling Booth Locator"
            description="Find your polling station location on the map."
            buttonText="Open Map"
            accentColor="green"
            to="/booth"
          />
          <ActionCard
            icon="📝"
            title="4. Election Day Prep"
            description="Know what documents to carry and important guidelines."
            buttonText="View Checklist"
            accentColor="orange"
            onClick={() => setShowChecklist(true)}
          />
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights-section">
        <div className="highlights-grid">
          {highlights.map((highlight) => (
            <div key={highlight.id} className="highlight-card">
              <div className="highlight-icon">{highlight.icon}</div>
              <div className="highlight-text">
                <h3 className="highlight-title">{highlight.title}</h3>
                <p className="highlight-description">{highlight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist Modal */}
      {showChecklist && (
        <div
          className="checklist-modal-overlay"
          onClick={() => setShowChecklist(false)}
          role="presentation"
        >
          <div
            className="checklist-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checklist-title"
          >
            <div className="modal-header">
              <h2 id="checklist-title">Election Day Checklist</h2>
              <button
                className="modal-close"
                onClick={() => setShowChecklist(false)}
                aria-label="Close checklist modal"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="checklist-progress-container">
              <div className="progress-stats">
                <span className="progress-text">
                  {completedCount} of {totalCount} tasks complete
                </span>
              </div>
              <div className="progress-bar-wrapper">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={completedCount}
                  aria-valuemin={0}
                  aria-valuemax={totalCount}
                  aria-label={`${completedCount} of ${totalCount} checklist items completed`}
                ></div>
              </div>
            </div>

            <div className="modal-body">
              <ul className="checklist-items">
                <li>
                  <input type="checkbox" id="check1" checked={checklistItems.check1} onChange={handleChecklistChange} />
                  <label htmlFor="check1">Confirm your voter registration</label>
                </li>
                <li>
                  <input type="checkbox" id="check2" checked={checklistItems.check2} onChange={handleChecklistChange} />
                  <label htmlFor="check2">Know your polling booth location</label>
                </li>
                <li>
                  <input type="checkbox" id="check3" checked={checklistItems.check3} onChange={handleChecklistChange} />
                  <label htmlFor="check3">Research candidates and issues</label>
                </li>
                <li>
                  <input type="checkbox" id="check4" checked={checklistItems.check4} onChange={handleChecklistChange} />
                  <label htmlFor="check4">Plan your transportation</label>
                </li>
                <li>
                  <input type="checkbox" id="check5" checked={checklistItems.check5} onChange={handleChecklistChange} />
                  <label htmlFor="check5">Bring valid ID to polling booth</label>
                </li>
                <li>
                  <input type="checkbox" id="check6" checked={checklistItems.check6} onChange={handleChecklistChange} />
                  <label htmlFor="check6">Arrive early to avoid long queues</label>
                </li>
                <li>
                  <input type="checkbox" id="check7" checked={checklistItems.check7} onChange={handleChecklistChange} />
                  <label htmlFor="check7">Get adequate sleep the night before</label>
                </li>
                <li>
                  <input type="checkbox" id="check8" checked={checklistItems.check8} onChange={handleChecklistChange} />
                  <label htmlFor="check8">Review election guidelines and procedures</label>
                </li>
              </ul>

              {/* Ready Message */}
              {allCompleted && (
                <div className="ready-message" role="alert">
                  <CheckCircle size={24} />
                  <div>
                    <h3>You are ready to vote!</h3>
                    <p>You've completed all preparation steps. Go out and vote with confidence!</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => setShowChecklist(false)}
                type="button"
              >
                {allCompleted ? 'See You at the Polls!' : 'Got It!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
