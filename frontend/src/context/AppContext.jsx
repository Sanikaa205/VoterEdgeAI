import React, { createContext, useState, useCallback } from 'react'

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateUser = useCallback((userData) => {
    setUser(userData)
  }, [])

  const value = {
    user,
    setUser,
    updateUser,
    isLoading,
    setIsLoading,
    error,
    setError,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContext
