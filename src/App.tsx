import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './config/supabase'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import './App.css'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabase) {
          setError('Supabase is not configured. Please add your API credentials to .env.local')
          setLoading(false)
          return
        }

        const { data: { session } } = await supabase.auth.getSession()
        setIsLoggedIn(!!session?.user)
        setLoading(false)
      } catch (err) {
        console.error('Auth check error:', err)
        setError('Failed to check authentication status')
        setLoading(false)
      }
    }

    checkAuth()

    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff'
      }}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h1 style={{ color: '#ff6b6b', marginBottom: '20px' }}>⚠️ Configuration Error</h1>
          <p style={{ marginBottom: '20px', color: '#666666' }}>{error}</p>
          <p style={{ color: '#666666' }}>Please check your Supabase credentials in .env.local</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/home" /> : <Register />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isLoggedIn ? '/home' : '/login'} />} />
      </Routes>
    </Router>
  )
}
