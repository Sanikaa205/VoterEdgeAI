import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { LogIn } from 'lucide-react'

/**
 * ProtectedContent Component
 * 
 * Wraps page content to show only authenticated users.
 * If user is not logged in, displays a centered sign-in message.
 * 
 * Props:
 *  - children: The content to show when authenticated
 *  - onSignIn: Optional callback for sign-in button
 */
const ProtectedContent = ({ children, onSignIn }) => {
  const { user } = useContext(AppContext)

  if (user) {
    return children
  }

  // Not authenticated - show centered message
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '500px',
        padding: '40px 24px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#4F46E5'
        }}>
          <LogIn size={28} />
        </div>

        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#111928',
          margin: '0 0 8px 0'
        }}>
          Sign in to continue
        </h3>

        <p style={{
          fontSize: '14px',
          color: '#6B7280',
          margin: '0 0 20px 0',
          lineHeight: '1.5'
        }}>
          Please sign in to access this feature and continue your voting journey.
        </p>

        {onSignIn && (
          <button
            onClick={onSignIn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #1A56DB 0%, #1E40AF 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)'
              e.target.style.boxShadow = '0 4px 14px rgba(26, 86, 219, 0.35)'
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'none'
              e.target.style.boxShadow = 'none'
            }}
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default ProtectedContent
