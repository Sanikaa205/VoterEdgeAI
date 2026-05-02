import React, { createContext, useState, useEffect, useCallback } from 'react'

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('voteredge_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('voteredge_user')
      }
    }
  }, [])

  const updateUser = useCallback((userData) => {
    setUser(userData)
    if (userData) {
      localStorage.setItem('voteredge_user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('voteredge_user')
    }
  }, [])

  const signInWithEmail = useCallback((email, name = '') => {
    const userData = {
      uid: Math.random().toString(36).substr(2, 9),
      email,
      displayName: name || email.split('@')[0],
      photoURL: null,
      createdAt: new Date().toISOString()
    }
    updateUser(userData)
    return userData
  }, [updateUser])

  const openSignIn = useCallback(() => {
    setIsSignInOpen(true)
  }, [])

  const closeSignIn = useCallback(() => {
    setIsSignInOpen(false)
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    localStorage.removeItem('voteredge_user')
  }, [])

  const value = {
    user,
    setUser,
    updateUser,
    signInWithEmail,
    openSignIn,
    closeSignIn,
    isSignInOpen,
    signOut,
    isLoading,
    setIsLoading,
    error,
    setError,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContext
