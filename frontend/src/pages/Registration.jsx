import React, { useState } from 'react'
import RegistrationChecker from '../components/RegistrationChecker'
import ElectionTimeline from '../components/ElectionTimeline'

const Registration = () => {
  const [selectedState, setSelectedState] = useState('')

  return (
    <div className="page-section">
      <div className="page-header">
        <h1>Voter Registration</h1>
        <p>Check your registration status and learn how to register to vote</p>
      </div>

      {/* Registration Checker */}
      <section style={{ marginBottom: '32px' }}>
        <RegistrationChecker onStateChange={setSelectedState} />
      </section>

      {/* Election Timeline */}
      <section>
        <ElectionTimeline state={selectedState} />
      </section>
    </div>
  )
}

export default Registration
