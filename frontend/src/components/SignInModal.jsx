import React, { useContext, useState } from 'react'
import { X, LogIn } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import './SignInModal.css'

const SignInModal = () => {
  const { isSignInOpen, closeSignIn, signInWithEmail } = useContext(AppContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  if (!isSignInOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmedEmail = email.trim()

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    signInWithEmail(trimmedEmail, name.trim())
    setName('')
    setEmail('')
    setError('')
    closeSignIn()
  }

  return (
    <div className="signin-modal-backdrop" role="dialog" aria-modal="true" aria-label="Sign in">
      <div className="signin-modal">
        <button className="signin-modal-close" onClick={closeSignIn} aria-label="Close sign in dialog">
          <X size={18} />
        </button>

        <div className="signin-modal-header">
          <div className="signin-modal-icon">
            <LogIn size={24} />
          </div>
          <h2>Sign in to continue</h2>
          <p>Use your email and name. No Firebase popup, no extra setup.</p>
        </div>

        <form onSubmit={handleSubmit} className="signin-modal-form">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signin-input"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signin-input"
            required
          />
          {error && <div className="signin-error" role="alert">{error}</div>}
          <button type="submit" className="signin-submit-btn">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignInModal
