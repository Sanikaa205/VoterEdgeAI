import React, { useState, useContext } from 'react'
import RegistrationChecker from '../components/RegistrationChecker'
import ElectionTimeline from '../components/ElectionTimeline'
import ProtectedContent from '../components/ProtectedContent'
import { AppContext } from '../context/AppContext'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../config/firebase'

const Registration = () => {
  const [selectedState, setSelectedState] = useState('')
  const { user, setUser } = useContext(AppContext)

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      setUser({
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        uid: result.user.uid,
      })
    } catch (err) {
      console.error('Sign-in error:', err)
    }
  }

  return (
    <div className="page-section">
      <div className="page-header">
        <h1>Voter Registration</h1>
        <p>Check your registration status and learn how to register to vote</p>
      </div>

      <ProtectedContent onSignIn={handleGoogleSignIn}>
        {/* Registration Checker */}
        <section style={{ marginBottom: '32px' }}>
          <RegistrationChecker onStateChange={setSelectedState} />
        </section>

        {/* Election Timeline */}
        <section>
          <ElectionTimeline state={selectedState} user={user} />
        </section>
      </ProtectedContent>
    </div>
  )
}

export default Registration
