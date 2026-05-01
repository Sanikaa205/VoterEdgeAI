import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary.jsx'

function Bomb() {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  it('catches errors and shows fallback', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    )
    expect(screen.getByText(/Something went wrong/i)).toBeTruthy()
  })
})
