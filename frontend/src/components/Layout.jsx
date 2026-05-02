import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import SignInModal from './SignInModal'
import './Layout.css'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="layout-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuClick={toggleSidebar} />
      <main className="main-content">
        <Outlet />
      </main>
      <SignInModal />
    </div>
  )
}

export default Layout
