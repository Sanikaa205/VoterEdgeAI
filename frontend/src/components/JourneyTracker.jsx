import React from 'react'
import './JourneyTracker.css'

const JourneyTracker = () => {
  const steps = [
    { id: 1, label: 'Registration', status: 'completed' },
    { id: 2, label: 'Candidates', status: 'current' },
    { id: 3, label: 'Booth Locator', status: 'upcoming' },
    { id: 4, label: 'Election Day Prep', status: 'upcoming' },
  ]

  const completedCount = steps.filter(s => s.status === 'completed').length
  const progressPercent = Math.round((completedCount / steps.length) * 100)

  return (
    <div className="journey-tracker">
      <div className="tracker-header">
        <div>
          <h2 className="tracker-title">Your Voting Journey</h2>
          <p className="tracker-subtitle">Complete these steps to be election-ready.</p>
        </div>
        <span className="tracker-progress-text">{progressPercent}% Completed</span>
      </div>

      <div className="tracker-steps">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`tracker-step status-${step.status}`}>
              <div className="step-circle">
                <span className="step-number">{step.id}</span>
              </div>
              <p className="step-label">{step.label}</p>
            </div>

            {index < steps.length - 1 && (
              <div className={`step-connector status-${step.status}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default JourneyTracker
