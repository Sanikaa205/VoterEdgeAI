import React, { useState, useEffect, useContext } from 'react'
import CandidateCard from '../components/CandidateCard'
import ProtectedContent from '../components/ProtectedContent'
import { AppContext } from '../context/AppContext'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../config/firebase'
import './Candidates.css'

const Candidates = () => {
  const { setUser } = useContext(AppContext)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedParty, setSelectedParty] = useState('All')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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

  const states = ['Maharashtra', 'Gujarat', 'Karnataka']
  const parties = ['All', 'National Democratic Party', 'Progressive Alliance', 'Economic Party']

  // Fetch candidates based on filters
  const fetchCandidates = async (state = selectedState, party = selectedParty) => {
    setLoading(true)
    setError('')

    try {
      // Build query string
      let queryParams = new URLSearchParams()

      if (state) {
        queryParams.append('state', state)
      }

      if (party && party !== 'All') {
        queryParams.append('party', party)
      }

      const queryString = queryParams.toString()
      const url = queryString
        ? `${API_URL}/api/candidates?${queryString}`
        : `${API_URL}/api/candidates`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch candidates')
      }

      const data = await response.json()

      if (data.success) {
        setCandidates(data.data || [])
      } else {
        setError(data.error || 'Failed to fetch candidates')
        setCandidates([])
      }
    } catch (err) {
      console.error('Error fetching candidates:', err)
      setError(err.message || 'Failed to fetch candidates. Please try again.')
      setCandidates([])
    } finally {
      setLoading(false)
    }
  }

  // Load candidates on component mount
  useEffect(() => {
    fetchCandidates('', 'All')
  }, [])

  // Handle state filter change
  const handleStateChange = (e) => {
    const newState = e.target.value
    setSelectedState(newState)
    fetchCandidates(newState, selectedParty)
  }

  // Handle party filter change
  const handlePartyChange = (party) => {
    setSelectedParty(party)
    fetchCandidates(selectedState, party)
  }

  return (
    <div className="page-section">
      {/* Page Header */}
      <div className="page-header">
        <h1>Explore Candidates</h1>
        <p>Learn about candidates contesting in your state</p>
      </div>

      <ProtectedContent onSignIn={handleGoogleSignIn}>
        {/* Filter Section */}
        <div className="candidates-filters">
          {/* State Filter */}
          <div className="filter-group">
            <label htmlFor="state-select" className="filter-label">
              Select State
            </label>
            <select
              id="state-select"
              value={selectedState}
              onChange={handleStateChange}
              className="state-select"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Party Filter */}
          <div className="filter-group">
            <label className="filter-label">Filter by Party</label>
            <div className="party-buttons">
              {parties.map((party) => (
                <button
                  key={party}
                  onClick={() => handlePartyChange(party)}
                  className={`party-btn ${
                    selectedParty === party ? 'active' : ''
                  }`}
                  aria-pressed={selectedParty === party}
                >
                  {party}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        {/* Loading State - Skeleton Loaders */}
        {loading && (
          <div className="candidates-grid">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="candidate-skeleton">
                <div className="skeleton-header">
                  <div className="skeleton-title" />
                  <div className="skeleton-badge" />
                </div>
                <div className="skeleton-meta">
                  <div className="skeleton-line" />
                  <div className="skeleton-line" />
                </div>
                <div className="skeleton-tags">
                  <div className="skeleton-tag" />
                  <div className="skeleton-tag" />
                  <div className="skeleton-tag" />
                </div>
                <div className="skeleton-button" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && candidates.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h2>No candidates found</h2>
            <p>No candidates found for your selection.</p>
            <p>Try adjusting your filters to see more results.</p>
          </div>
        )}

        {/* Candidates Grid */}
        {!loading && candidates.length > 0 && (
          <>
            <div className="results-info">
              Showing {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
            </div>
            <div className="candidates-grid">
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          </>
        )}
      </ProtectedContent>
    </div>
  )
}

export default Candidates
