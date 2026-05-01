import React, { useContext } from 'react'
import BoothLocator from '../components/BoothLocator'
import ProtectedContent from '../components/ProtectedContent'
import { AppContext } from '../context/AppContext'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../config/firebase'

const MyBooth = () => {
  const { setUser } = useContext(AppContext)

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
        <h1>My Polling Booth</h1>
        <p>Find your nearest polling location</p>
      </div>

      <ProtectedContent onSignIn={handleGoogleSignIn}>
        <BoothLocator />
      </ProtectedContent>
    </div>
  )
}

export default MyBooth
