import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AIChat from './components/AIChat'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Candidates from './pages/Candidates'
import MyBooth from './pages/MyBooth'
import FAQ from './pages/FAQ'
import HowToVote from './pages/HowToVote'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/booth" element={<MyBooth />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/how-to-vote" element={<HowToVote />} />
          </Route>
        </Routes>
        <AIChat />
      </Router>
    </ErrorBoundary>
  )
}

export default App
