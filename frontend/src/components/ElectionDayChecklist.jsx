import React, { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import './ElectionDayChecklist.css'

const ElectionDayChecklist = ({ isOpen, onClose }) => {
  const [checklistItems, setChecklistItems] = useState({
    check1: false,
    check2: false,
    check3: false,
    check4: false,
    check5: false,
    check6: false,
    check7: false,
    check8: false,
  })

  // Load checklist from localStorage on mount
  useEffect(() => {
    const savedChecklist = localStorage.getItem('electionDayChecklist')
    if (savedChecklist) {
      try {
        setChecklistItems(JSON.parse(savedChecklist))
      } catch (error) {
        console.error('Error loading checklist:', error)
      }
    }
  }, [])

  // Save checklist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('electionDayChecklist', JSON.stringify(checklistItems))
  }, [checklistItems])

  const handleChecklistChange = (e) => {
    const { id, checked } = e.target
    setChecklistItems((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  const completedCount = Object.values(checklistItems).filter(Boolean).length
  const totalCount = Object.keys(checklistItems).length
  const allCompleted = completedCount === totalCount

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="checklist-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="checklist-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checklist-title"
      >
        <div className="modal-header">
          <h2 id="checklist-title">Election Day Checklist</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close checklist modal"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="checklist-progress-container">
          <div className="progress-stats">
            <span className="progress-text">
              {completedCount} of {totalCount} tasks complete
            </span>
          </div>
          <div className="progress-bar-wrapper">
            <div
              className="progress-bar-fill"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
              role="progressbar"
              aria-valuenow={completedCount}
              aria-valuemin={0}
              aria-valuemax={totalCount}
              aria-label={`${completedCount} of ${totalCount} checklist items completed`}
            ></div>
          </div>
        </div>

        <div className="modal-body">
          <ul className="checklist-items">
            <li>
              <input
                type="checkbox"
                id="check1"
                checked={checklistItems.check1}
                onChange={handleChecklistChange}
              />
              <label htmlFor="check1">Confirm your voter registration</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="check2"
                checked={checklistItems.check2}
                onChange={handleChecklistChange}
              />
              <label htmlFor="check2">Know your polling booth location</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="check3"
                checked={checklistItems.check3}
                onChange={handleChecklistChange}
              />
              <label htmlFor="check3">Research candidates and issues</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="check4"
                checked={checklistItems.check4}
                onChange={handleChecklistChange}
              />
              <label htmlFor="check4">Plan your transportation</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="check5"
                checked={checklistItems.check5}
                onChange={handleChecklistChange}
              />
              <label htmlFor="check5">Bring valid ID to polling booth</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="check6"
                checked={checklistItems.check6}
                onChange={handleChecklistChange}
              />
              <label htmlFor="check6">Arrive early to avoid long queues</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="check7"
                checked={checklistItems.check7}
                onChange={handleChecklistChange}
              />
              <label htmlFor="check7">Get adequate sleep the night before</label>
            </li>
            <li>
              <input
                type="checkbox"
                id="check8"
                checked={checklistItems.check8}
                onChange={handleChecklistChange}
              />
              <label htmlFor="check8">Review election guidelines and procedures</label>
            </li>
          </ul>

          {/* Ready Message */}
          {allCompleted && (
            <div className="ready-message" role="alert">
              <CheckCircle size={24} />
              <div>
                <h3>You are ready to vote!</h3>
                <p>You've completed all preparation steps. Go out and vote with confidence!</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            className="btn-primary"
            onClick={onClose}
            type="button"
          >
            {allCompleted ? 'See You at the Polls!' : 'Got It!'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ElectionDayChecklist
