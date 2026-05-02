import { useContext, useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, LogOut, LogIn, ChevronDown, X } from 'lucide-react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider } from "../config/firebase";
import { AppContext } from '../context/AppContext'
import './Header.css'

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  const { user, signOut: contextSignOut, signInWithEmail } = useContext(AppContext)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const userMenuRef = useRef(null)

  // Page titles based on route
  const pageTitles = {
    '/': 'Home',
    '/registration': 'Registration',
    '/candidates': 'Candidates',
    '/booth': 'My Booth',
    '/faq': 'FAQ',
  }

  const pageTitle = pageTitles[location.pathname] || 'VoterEdge AI'

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      signInWithEmail(result.user.email, result.user.displayName)
    } catch (error) {
      // Fall back to email form
      setShowEmailForm(true)
    }
  }

  // Email Sign In
  const handleEmailSignIn = (e) => {
    e.preventDefault()
    if (email.trim()) {
      signInWithEmail(email, name)
      setEmail('')
      setName('')
      setShowEmailForm(false)
    }
  }

  // Sign Out
  const handleSignOut = async () => {
    try {
      contextSignOut()
      setShowUserMenu(false)
    } catch (error) {
      // Sign-out error handled silently
    }
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="header-title">{pageTitle}</h1>
      </div>

      <div className="header-right">
        {/* User Authentication */}
        {user ? (
          <div className="user-menu-container" ref={userMenuRef}>
            <button
              className="user-avatar-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="User menu"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-placeholder">
                  {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <ChevronDown size={16} className="chevron-icon" />
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p className="user-name">{user.displayName || user.email}</p>
                  <p className="user-email">{user.email}</p>
                </div>
                <hr className="dropdown-divider" />
                <button
                  onClick={handleSignOut}
                  className="dropdown-item logout-item"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : showEmailForm ? (
          <div className="email-signin-form">
            <button
              className="close-form-btn"
              onClick={() => setShowEmailForm(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <form onSubmit={handleEmailSignIn}>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
              <button type="submit" className="form-submit-btn">
                Sign In
              </button>
            </form>
            <button
              className="google-signin-fallback"
              onClick={handleGoogleSignIn}
            >
              Try Google Sign In
            </button>
          </div>
        ) : (
          <button
            className="sign-in-btn"
            onClick={handleGoogleSignIn}
            aria-label="Sign in"
          >
            <LogIn size={18} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
