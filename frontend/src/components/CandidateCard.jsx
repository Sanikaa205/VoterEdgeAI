import React, { useState, useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import CandidateModal from './CandidateModal'
import './CandidateCard.css'

const CandidateCard = ({ candidate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Memoize party color calculation
  const partyColor = useMemo(() => {
    const colors = {
      'National Democratic Party': { bg: '#DDD6FE', text: '#6D28D9' },
      'Progressive Alliance': { bg: '#DBEAFE', text: '#0284C7' },
      'Economic Party': { bg: '#FECDD3', text: '#BE123C' }
    }
    return colors[candidate.party] || { bg: '#E5E7EB', text: '#374151' }
  }, [candidate.party])

  const criminalRecordCount = useMemo(() => {
    return candidate.criminalRecords ? 1 : 0
  }, [candidate.criminalRecords])

  return (
    <>
      <div className="candidate-card">
        {/* Card Header */}
        <div className="card-header">
          <h3 className="candidate-name">{candidate.name}</h3>
          <span
            className="party-badge"
            style={{
              backgroundColor: partyColor.bg,
              color: partyColor.text
            }}
          >
            {candidate.party}
          </span>
        </div>

        {/* Card Meta Information */}
        <div className="card-meta">
          <p className="meta-item">
            <span className="meta-label">State:</span>
            <span className="meta-value">{candidate.state}</span>
          </p>
          <p className="meta-item">
            <span className="meta-label">Education:</span>
            <span className="meta-value">{candidate.education}</span>
          </p>
        </div>

        {/* Key Issues Tags */}
        <div className="issues-section">
          <p className="section-label">Key Issues</p>
          <div className="issues-tags">
            {candidate.issues.slice(0, 3).map((issue, idx) => (
              <span key={idx} className="issue-tag">
                {issue}
              </span>
            ))}
          </div>
        </div>

        {/* Criminal Record */}
        {criminalRecordCount > 0 && (
          <div className="criminal-record">
            <span className="record-badge">
              {criminalRecordCount} Criminal Record{criminalRecordCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* View Full Profile Button */}
        <button
          className="view-profile-btn"
          onClick={() => setIsModalOpen(true)}
          aria-label={`View full profile for ${candidate.name}`}
        >
          View Full Profile
          <ChevronRight size={18} />
        </button>

        {/* Data Disclaimer */}
        <p className="data-disclaimer">
          Data sourced from public records. VoterEdge AI is politically neutral.
        </p>
      </div>

      {/* Modal */}
      <CandidateModal
        candidate={candidate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

export default React.memo(CandidateCard)
