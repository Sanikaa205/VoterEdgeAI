import { useContext, useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, LogOut, LogIn, ChevronDown } from 'lucide-react'
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, provider } from "../config/firebase";
import { AppContext } from '../context/AppContext'
import './Header.css'

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  const { user, setUser, language, updateLanguage } = useContext(AppContext)
  const [showUserMenu, setShowUserMenu] = useState(false)
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
      setUser({
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        uid: result.user.uid,
      })
    } catch (error) {
      // Sign-in error handled silently
    }
  }

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUser(null)
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
        {/* Language Selector */}
        <div className="language-selector">
          <select
            value={language}
            onChange={(e) => updateLanguage(e.target.value)}
            aria-label="Select language"
            className="language-select"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

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
                  alt={user.name}
                  className="user-avatar"
                />
              ) : (
                <div className="user-avatar-placeholder">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <ChevronDown size={16} className="chevron-icon" />
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
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
        ) : (
          <button
            className="sign-in-btn"
            onClick={handleGoogleSignIn}
            aria-label="Sign in with Google"
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
