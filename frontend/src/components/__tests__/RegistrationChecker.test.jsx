import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/svelte'
import React from 'react'
import { render as r, screen } from '@testing-library/react'
import RegistrationChecker from '../RegistrationChecker.jsx'

describe('RegistrationChecker component', () => {
  it('renders three decision buttons', () => {
    r(<RegistrationChecker />)
    expect(screen.getByRole('button', { name: /Check registration status/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /How to vote/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /Find polling booth/i })).toBeTruthy()
  })
})
