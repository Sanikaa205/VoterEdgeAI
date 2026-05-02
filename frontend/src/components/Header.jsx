import { useContext, useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, LogOut, LogIn, ChevronDown, X } from 'lucide-react'
import { AppContext } from '../context/AppContext'
import './Header.css'

const Header = ({ onMenuClick }) => {
  const location = useLocation()
  const { user, signOut: contextSignOut, openSignIn } = useContext(AppContext)
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
        ) : (
          <button
            className="sign-in-btn"
            onClick={openSignIn}
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
