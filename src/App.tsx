import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRouter from './components/Router'
import { FeatureFlagProvider } from './context/FeatureFlagContext'

function App() {
  return (
    <FeatureFlagProvider>
      <Router>
        <AppRouter />
      </Router>
    </FeatureFlagProvider>
  )
}

export default App
