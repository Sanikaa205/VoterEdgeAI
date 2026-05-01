import React from 'react'
import { CheckCircle, FileText, Link2, Clock } from 'lucide-react'
import './HowToVote.css'

const HowToVote = () => {
  const steps = [
    {
      step: 1,
      icon: <CheckCircle size={28} />,
      title: 'Check Eligibility',
      description: 'You must be at least 18 years old and an Indian citizen with proper residence proof to be eligible for voter registration.'
    },
    {
      step: 2,
      icon: <FileText size={28} />,
      title: 'Gather Documents',
      description: 'Collect Aadhaar card, passport, birth certificate, or driving license as proof of age and address proof like utility bill or lease agreement.'
    },
    {
      step: 3,
      icon: <Link2 size={28} />,
      title: 'Apply Online',
      description: 'Visit the official NVSP portal (https://voters.eci.gov.in) and fill Form 6 with your details, address, and constituency information.'
    },
    {
      step: 4,
      icon: <Clock size={28} />,
      title: 'Wait for Verification',
      description: 'Submit your application and wait for verification. You\'ll receive updates on your registration status via email and SMS.'
    }
  ]

  const handleApplyNow = () => {
    window.open('https://voters.eci.gov.in/', '_blank')
  }

  return (
    <div className="how-to-vote-page">
      <div className="page-section">
        <div className="page-header">
          <h1>How to Become a Voter</h1>
          <p>Follow these simple steps to register as a voter and participate in elections</p>
        </div>

        <div className="steps-container">
          {steps.map((item) => (
            <div key={item.step} className="step-card">
              <div className="step-icon-wrapper">
                <div className="step-icon">
                  {item.icon}
                </div>
                <span className="step-number">{item.step}</span>
              </div>

              <div className="step-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="apply-section">
          <div className="apply-info">
            <h2>Ready to Register?</h2>
            <p>Click the button below to go to the official voter registration portal and start your registration process.</p>
          </div>

          <button className="btn-apply-now" onClick={handleApplyNow}>
            Apply Now
          </button>
        </div>

        <div className="help-section">
          <h3>Need Help?</h3>
          <p>For more information or to track your registration status, visit <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer">voters.eci.gov.in</a> or call the Election Commission Helpline at <strong>1950</strong>.</p>
        </div>
      </div>
    </div>
  )
}

export default HowToVote
