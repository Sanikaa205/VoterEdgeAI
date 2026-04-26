import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'
import './CandidateModal.css'

const CandidateModal = ({ candidate, isOpen, onClose }) => {
  const getPartyColor = (party) => {
    const colors = {
      'National Democratic Party': { bg: '#DDD6FE', text: '#6D28D9' },
      'Progressive Alliance': { bg: '#DBEAFE', text: '#0284C7' },
      'Economic Party': { bg: '#FECDD3', text: '#BE123C' }
    }
    return colors[party] || { bg: '#E5E7EB', text: '#374151' }
  }

  const partyColor = getPartyColor(candidate.party)
  const criminalRecordCount = candidate.criminalRecords ? 1 : 0

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="candidate-modal-wrapper"
        onClose={onClose}
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="modal-backdrop" />
        </Transition.Child>

        <div className="modal-container">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="modal-panel">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="modal-close-btn"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              {/* Modal Content */}
              <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                  <div>
                    <Dialog.Title id="modal-title" className="modal-title">
                      {candidate.name}
                    </Dialog.Title>
                    <span
                      className="modal-party-badge"
                      style={{
                        backgroundColor: partyColor.bg,
                        color: partyColor.text
                      }}
                    >
                      {candidate.party}
                    </span>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="modal-info-grid">
                  <div className="info-item">
                    <span className="info-label">State</span>
                    <span className="info-value">{candidate.state}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Education</span>
                    <span className="info-value">{candidate.education}</span>
                  </div>
                </div>

                {/* Biography */}
                <div className="modal-section">
                  <h3 className="section-heading">Biography</h3>
                  <p className="section-content">{candidate.bio}</p>
                </div>

                {/* Key Issues */}
                <div className="modal-section">
                  <h3 className="section-heading">Key Issues & Platform</h3>
                  <ul className="issues-list">
                    {candidate.issues.map((issue, idx) => (
                      <li key={idx} className="issue-item">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Criminal Records */}
                {criminalRecordCount > 0 && (
                  <div className="modal-section criminal-section">
                    <h3 className="section-heading warning">
                      ⚠️ Criminal Records
                    </h3>
                    <p className="section-content">
                      {criminalRecordCount} criminal record{criminalRecordCount !== 1 ? 's' : ''} found in public records.
                    </p>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="modal-disclaimer">
                  <p>
                    <strong>Data Accuracy:</strong> All information sourced from public records. VoterEdge AI is politically neutral and does not endorse or oppose any candidate.
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="modal-action-btn"
                  aria-label="Close modal"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default CandidateModal
