import React, { createContext, useState, useCallback } from 'react'

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [language, setLanguage] = useState('en')

  const updateUser = useCallback((userData) => {
    setUser(userData)
  }, [])

  const updateLanguage = useCallback((lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }, [])

  const value = {
    user,
    setUser,
    updateUser,
    isLoading,
    setIsLoading,
    error,
    setError,
    language,
    setLanguage,
    updateLanguage,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContext
