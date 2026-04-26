import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AIChat from './components/AIChat'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Candidates from './pages/Candidates'
import MyBooth from './pages/MyBooth'
import FAQ from './pages/FAQ'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/booth" element={<MyBooth />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>
      </Routes>
      <AIChat />
    </Router>
  )
}

export default App
