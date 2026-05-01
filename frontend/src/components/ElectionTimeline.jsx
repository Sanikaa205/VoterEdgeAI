import React, { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'
import './ElectionTimeline.css'

const ElectionTimeline = ({ state, user }) => {
  // If the user is not authenticated, don't show empty placeholders.
  if (!user) return null
  const [timeline, setTimeline] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  useEffect(() => {
    if (!state) {
      setTimeline([])
      return
    }

    fetchTimeline(state)
  }, [state])

  const fetchTimeline = async (selectedState) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/timeline/${encodeURIComponent(selectedState)}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch timeline')
      }

      const data = await response.json()

      if (data.success) {
        setTimeline(data.data.timeline || [])
      } else {
        setError(data.error || 'Failed to load timeline')
      }
    } catch (err) {
      console.error('Error fetching timeline:', err)
      setError(err.message || 'Failed to fetch timeline')
    } finally {
      setLoading(false)
    }
  }

  const getEventStatus = (eventDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDateObj = new Date(eventDate)

    if (eventDateObj < today) {
      return 'completed'
    } else if (eventDateObj.toDateString() === today.toDateString()) {
      return 'current'
    } else {
      return 'upcoming'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="election-timeline">
      <div className="section-header">
        <h2>Election Timeline</h2>
        <p>Important dates and events for your state's election process</p>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {!state ? (
        <div className="empty-state">
          <p>Select a state from the Registration Checker above to view the election timeline</p>
        </div>
      ) : loading ? (
        <div className="loading-state">
          <Loader size={32} className="animate-spin" />
          <p>Loading timeline...</p>
        </div>
      ) : timeline.length === 0 ? (
        <div className="empty-state">
          <p>No timeline events found for {state}</p>
        </div>
      ) : (
        <div className="timeline-container">
          {timeline.map((event, index) => {
            const status = getEventStatus(event.date)
            return (
              <div
                key={index}
                className={`timeline-event ${status}`}
                role="listitem"
              >
                {/* Timeline Dot */}
                <div className="timeline-marker">
                  <div className={`timeline-dot ${status}`} />
                  <div className="timeline-line" />
                </div>

                {/* Event Content */}
                <div className="event-content">
                  <div className="event-header">
                    <span className="event-date">{formatDate(event.date)}</span>
                    <h3 className="event-label">{event.label}</h3>
                  </div>
                  <p className="event-description">{event.description}</p>

                  {status === 'current' && (
                    <div className="current-badge">Current Event</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ElectionTimeline
