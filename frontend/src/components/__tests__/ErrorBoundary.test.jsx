import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import ErrorBoundary from '../ErrorBoundary.jsx'

describe('ErrorBoundary', () => {
  it('derives error state from a thrown error', () => {
    expect(ErrorBoundary.getDerivedStateFromError(new Error('boom'))).toEqual({ hasError: true })
  })

  it('stores error details when componentDidCatch is called', () => {
    const instance = new ErrorBoundary({ children: null })
    const setState = vi.fn((update) => {
      instance.state = { ...instance.state, ...update }
    })
    instance.setState = setState

    instance.componentDidCatch(new Error('boom'), { componentStack: 'stack' })

    expect(setState).toHaveBeenCalled()
    expect(instance.state.error).toBeInstanceOf(Error)
    expect(instance.state.errorInfo).toEqual({ componentStack: 'stack' })
  })
})
