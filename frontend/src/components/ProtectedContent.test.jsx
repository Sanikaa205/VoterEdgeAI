import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import ProtectedContent from './ProtectedContent'
import { AppContext } from '../context/AppContext'

describe('ProtectedContent', () => {
  it('renders sign-in card when user is null', () => {
    const markup = renderToString(
      <AppContext.Provider value={{ user: null }}>
        <ProtectedContent />
      </AppContext.Provider>
    )

    expect(markup).toContain('Sign in to continue')
  })

  it('renders children when user exists', () => {
    const markup = renderToString(
      <AppContext.Provider value={{ user: { name: 'Test User' } }}>
        <ProtectedContent>
          <div>Protected Content Visible</div>
        </ProtectedContent>
      </AppContext.Provider>
    )

    expect(markup).toContain('Protected Content Visible')
  })
})
