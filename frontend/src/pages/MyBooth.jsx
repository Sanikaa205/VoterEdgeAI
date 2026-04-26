import React from 'react'
import BoothLocator from '../components/BoothLocator'

const MyBooth = () => {
  return (
    <div className="page-section">
      <div className="page-header">
        <h1>My Polling Booth</h1>
        <p>Find your nearest polling location</p>
      </div>

      <BoothLocator />
    </div>
  )
}

export default MyBooth
