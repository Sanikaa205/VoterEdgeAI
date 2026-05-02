import React, { useContext } from 'react'
import BoothLocator from '../components/BoothLocator'
import ProtectedContent from '../components/ProtectedContent'
import { AppContext } from '../context/AppContext'

const MyBooth = () => {
  const { openSignIn } = useContext(AppContext)

  return (
    <div className="page-section">
      <div className="page-header">
        <h1>My Polling Booth</h1>
        <p>Find your nearest polling location</p>
      </div>

      <ProtectedContent onSignIn={openSignIn}>
        <BoothLocator />
      </ProtectedContent>
    </div>
  )
}

export default MyBooth
