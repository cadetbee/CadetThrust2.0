import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>Cadet Thrust</h1>
          <p>An unofficial website of Sylhet Cadet College</p>
        </div>
        <button onClick={handleLogout} className="btn logout-btn">
          Logout
        </button>
      </header>

      <main className="home-content">
        <div className="container">
          <h2>Welcome Home</h2>
          <p>This page is currently under development.</p>
          {/* Add your home page content here */}
        </div>
      </main>
    </div>
  )
}
