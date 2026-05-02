import React, { useContext } from 'react'
import RegistrationChecker from '../components/RegistrationChecker'
import ProtectedContent from '../components/ProtectedContent'
import { AppContext } from '../context/AppContext'

const Registration = () => {
  const { openSignIn } = useContext(AppContext)

  return (
    <div className="page-section">
      <div className="page-header">
        <h1>Voter Registration</h1>
        <p>Check your registration status and learn how to register to vote</p>
      </div>

      <ProtectedContent onSignIn={openSignIn}>
        {/* Registration Checker */}
        <section style={{ marginBottom: '32px' }}>
          <RegistrationChecker />
        </section>
      </ProtectedContent>
    </div>
  )
}

export default Registration
