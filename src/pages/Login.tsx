import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../config/supabase'
import './Auth.css'

export default function Login() {
  const [accountName, setAccountName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!accountName || !password) {
        setError('⚠️ Please fill in all fields')
        setLoading(false)
        return
      }

      // Query the database to find user by account_name
      const { data: userData, error: queryError } = await supabase
        .from('users')
        .select('id, email')
        .eq('account_name', accountName)
        .single()

      if (queryError || !userData) {
        setError('⚠️ Wrong Account Name')
        setLoading(false)
        return
      }

      // Try to sign in with email and password
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password
      })

      if (signInError || !data.user) {
        setError('⚠️ Wrong Password!')
        setLoading(false)
        return
      }

      // Login successful
      setTimeout(() => {
        navigate('/home')
      }, 1000)
    } catch (err) {
      console.error('Login error:', err)
      setError('⚠️ An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="site-title">Cadet Thrust</h1>
        <p className="site-slogan">An unofficial website of Sylhet Cadet College</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="accountName">Account Name</label>
            <input
              id="accountName"
              type="text"
              placeholder="Enter your account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="text-muted">Haven't Any Account?</p>
          <Link to="/register" className="auth-link">
            Create a New Account
          </Link>
        </div>
      </div>
    </div>
  )
}
