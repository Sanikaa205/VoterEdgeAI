import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { AppContext } from '../../context/AppContext.jsx'
import RegistrationChecker from '../RegistrationChecker.jsx'

describe('RegistrationChecker component', () => {
  it('renders the three voting decision buttons', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <AppContext.Provider value={{ user: null }}>
          <RegistrationChecker />
        </AppContext.Provider>
      </MemoryRouter>
    )

    expect(markup).toContain('Check if I am a registered voter')
    expect(markup).toContain('I am a verified voter')
    expect(markup).toContain('How to become a voter')
  })
})
