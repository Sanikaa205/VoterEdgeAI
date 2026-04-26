import { NavLink } from 'react-router-dom'
import { Home, ClipboardCheck, Users, MapPin, HelpCircle, X, Shield } from 'lucide-react'
import './Sidebar.css'

const Sidebar = ({ isOpen, onClose }) => {
  const navLinks = [
    { path: '/', label: 'Home', Icon: Home },
    { path: '/registration', label: 'Registration', Icon: ClipboardCheck },
    { path: '/candidates', label: 'Candidates', Icon: Users },
    { path: '/booth', label: 'My Booth', Icon: MapPin },
    { path: '/faq', label: 'FAQ', Icon: HelpCircle },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <nav className={`sidebar ${isOpen ? 'open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <Shield size={22} />
            </div>
            <div className="brand-text">
              <h2 className="sidebar-logo">VoterEdge AI</h2>
              <span className="sidebar-tagline">Your Smart Voting Guide</span>
            </div>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <ul className="nav-list">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
                end={link.path === '/'}
              >
                <link.Icon size={20} className="nav-icon" />
                <span className="nav-label">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="sidebar-footer">
          <div className="neutrality-shield">
            <Shield size={20} className="shield-icon" />
            <div className="shield-text">
              <h4>Neutrality Shield</h4>
              <p>We provide unbiased, factual information. No political affiliations.</p>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Sidebar
