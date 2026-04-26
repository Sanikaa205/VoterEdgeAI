import React from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { ChevronUp } from 'lucide-react'
import './FAQ.css'

const FAQ = () => {
  const faqs = [
    {
      id: 1,
      question: 'How do I know if I am registered to vote?',
      answer:
        'You can check your voter registration status by visiting the Electoral Commission website or using our "Check Registration" feature. You\'ll need to provide your full name, date of birth, and state. You can also visit your local electoral office with valid ID to verify your registration status.'
    },
    {
      id: 2,
      question: 'What documents do I need to bring to vote?',
      answer:
        'You must bring a valid ID proof such as Aadhaar Card, Passport, Driving License, PAN Card, or Voter ID. The ID should be currently valid or have been valid within 3 years. Bring your voter slip (if you have it) along with any one of the valid IDs mentioned above.'
    },
    {
      id: 3,
      question: 'Can I vote if I have moved to a new address?',
      answer:
        'If you have moved to a new address, you need to update your voter registration with your new address. You can do this by submitting Form 8-A to your new Electoral Registration Officer. Once your registration is updated in the new constituency, you can vote from the polling booth in your new area.'
    },
    {
      id: 4,
      question: 'What if my name is not on the voter list?',
      answer:
        'If your name is missing from the voter list despite having registered, you can file a complaint at your polling station. Ask for Form 7 to challenge the incorrect/omitted entries. Electoral officials can verify your eligibility and add your name if you meet all requirements. You may need to present identification and proof of residence.'
    },
    {
      id: 5,
      question: 'How does the EVM (Electronic Voting Machine) work?',
      answer:
        'The EVM has two units: the Ballot Unit (where voters mark their votes) and the Control Unit (operated by polling staff). When you enter the voting booth, the polling officer will press a button on the Control Unit to enable voting. You press the blue button next to your chosen candidate to record your vote. EVMs are tamper-proof and produce a VVPAT (paper trail) for verification.'
    },
    {
      id: 6,
      question: 'Is voting mandatory?',
      answer:
        'Voting is not legally mandatory in India. However, it is every citizen\'s civic duty to participate in elections. By voting, you help shape the future of your constituency and country. While there are no penalties for not voting, encouraging voter participation strengthens democratic processes.'
    },
    {
      id: 7,
      question: 'Can I take a photo at the polling booth?',
      answer:
        'No, photography and videography are strictly prohibited inside the polling booth to maintain the secrecy of the ballot and prevent vote-buying. However, you can take a photo of your inked finger (if using paper ballots) outside the polling station as a mark of having voted. Social media sharing of polling booth photos is also discouraged.'
    },
    {
      id: 8,
      question: 'What is NOTA and how do I use it?',
      answer:
        'NOTA (None of the Above) is an option that allows voters to reject all candidates if they don\'t find any suitable option. NOTA button is always the last option on the EVM or ballot. Pressing it records your vote as "None of the Above" and is counted separately. Using NOTA does not spoil your vote.'
    },
    {
      id: 9,
      question: 'How are votes counted?',
      answer:
        'After voting closes, polling stations conduct a manual count of the votes or use electronic counting machines depending on the election type. Poll observers from various parties are present during counting for transparency. The Returning Officer verifies the count and announces results at their headquarters. The entire process is recorded and documented.'
    },
    {
      id: 10,
      question: 'Where can I check election results?',
      answer:
        'You can check election results on the official Electoral Commission website, state election commission websites, or the ECI mobile app. Major news channels also provide live result updates. You can search for results by constituency, state, or candidate name. Results are typically announced within 24-48 hours after voting concludes.'
    }
  ]

  return (
    <div className="faq-page">
      {/* Header */}
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about voting, registration, and the election process</p>
      </div>

      {/* FAQ Accordion */}
      <div className="faq-container">
        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <Disclosure key={faq.id} defaultOpen={index === 0}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="faq-question">
                    <span className="question-text">{faq.question}</span>
                    <ChevronUp
                      size={20}
                      className={`chevron-icon ${open ? 'open' : ''}`}
                      aria-hidden="true"
                    />
                  </Disclosure.Button>

                  <Transition
                    show={open}
                    enter="transition duration-200 ease-out"
                    enterFrom="transform opacity-0 -translate-y-2"
                    enterTo="transform opacity-100 translate-y-0"
                    leave="transition duration-150 ease-out"
                    leaveFrom="transform opacity-100 translate-y-0"
                    leaveTo="transform opacity-0 -translate-y-2"
                  >
                    <Disclosure.Panel className="faq-answer">
                      {faq.answer}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          ))}
        </div>

        {/* Sidebar Info */}
        <aside className="faq-sidebar">
          <div className="info-card">
            <h3>Need More Help?</h3>
            <p>
              If you can't find the answer you're looking for, reach out to us through the chat
              feature or contact your local Electoral Commission office.
            </p>
          </div>

          <div className="info-card helpful">
            <h3>Quick Links</h3>
            <ul className="quick-links">
              <li>
                <a href="https://www.eci.gov.in" target="_blank" rel="noopener noreferrer">
                  Electoral Commission Official Site
                </a>
              </li>
              <li>
                <a href="https://www.eci.gov.in/statistical-report" target="_blank" rel="noopener noreferrer">
                  Election Statistics
                </a>
              </li>
              <li>
                <a href="https://voter.eci.gov.in" target="_blank" rel="noopener noreferrer">
                  Voter Helpline Portal
                </a>
              </li>
            </ul>
          </div>

          <div className="info-card voting-tips">
            <h3>Voting Tips</h3>
            <ul className="tips-list">
              <li>Arrive early to your polling booth</li>
              <li>Bring valid ID proof</li>
              <li>Check booth location beforehand</li>
              <li>Vote without fear or pressure</li>
              <li>Your vote is confidential</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default FAQ
