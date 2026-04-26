import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import './ActionCard.css'

const ActionCard = ({ 
  icon, 
  title, 
  description, 
  buttonText = 'Learn More', 
  accentColor = 'blue',
  to = null,
  onClick = null 
}) => {
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (onClick) {
      onClick(e)
    } else if (to) {
      navigate(to)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick(e)
    }
  }

  return (
    <div
      className={`action-card accent-border-${accentColor}`}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`${title}: ${description}`}
    >
      <div className={`card-icon accent-${accentColor}`}>
        {icon}
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <button
        className={`card-button accent-${accentColor}`}
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={e => { e.stopPropagation(); handleClick(e); }}
      >
        {buttonText}
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

export default ActionCard
