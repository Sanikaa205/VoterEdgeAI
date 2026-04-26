import React, { useState } from 'react'
import JourneyTracker from '../components/JourneyTracker'
import RegistrationChecker from '../components/RegistrationChecker'
import ElectionTimeline from '../components/ElectionTimeline'
import './MyJourney.css'

const MyJourney = () => {
  const [selectedState, setSelectedState] = useState('')

  return (
    <div className="page-section">
      <div className="page-header">
        <h1>My Voting Journey</h1>
        <p>Track your progress through the voting process</p>
      </div>

      {/* Journey Tracker */}
      <section className="journey-section">
        <JourneyTracker />
      </section>

      {/* Registration Checker */}
      <section className="journey-section">
        <RegistrationChecker onStateChange={setSelectedState} />
      </section>

      {/* Election Timeline */}
      <section className="journey-section">
        <ElectionTimeline state={selectedState} />
      </section>
    </div>
  )
}

export default MyJourney
