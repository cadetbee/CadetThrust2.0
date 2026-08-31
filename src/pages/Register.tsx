import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../config/supabase'
import './Auth.css'

const INTAKES = ['Intake 51', 'Intake 50', 'Intake 49', 'Intake 48', 'Intake 47', 'Intake 46']

export default function Register() {
  const [formData, setFormData] = useState({
    accountName: '',
    cadetName: '',
    cadetNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    batch: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    if (formData.accountName.length < 4 || formData.accountName.length > 16) {
      setError('⚠️ Account Name must be 4-16 characters')
      return false
    }
    if (formData.cadetName.length < 2 || formData.cadetName.length > 16) {
      setError('⚠️ Cadet Name must be 2-16 characters')
      return false
    }
    if (!/^\d{4}$/.test(formData.cadetNo)) {
      setError('⚠️ Cadet No. must be exactly 4 digits')
      return false
    }
    if (formData.password.length < 6) {
      setError('⚠️ Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('⚠️ Passwords do not match')
      return false
    }
    if (!formData.batch) {
      setError('⚠️ Please select a batch')
      return false
    }
    if (!formData.email) {
      setError('⚠️ Please enter an email')
      return false
    }
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      })

      if (signUpError || !authData.user) {
        setError('⚠️ ' + (signUpError?.message || 'Registration failed'))
        setLoading(false)
        return
      }

      // Insert user data into users table
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: formData.email,
          account_name: formData.accountName,
          cadet_name: formData.cadetName,
          cadet_no: formData.cadetNo,
          batch: formData.batch,
          created_at: new Date().toISOString()
        }])

      if (insertError) {
        setError('⚠️ Failed to save user data')
        console.error('Insert error:', insertError)
        setLoading(false)
        return
      }

      setSuccess('✅ Registration successful! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      console.error('Register error:', err)
      setError('⚠️ An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="site-title">Cadet Thrust</h1>
        <p className="site-slogan">An unofficial website of Sylhet Cadet College</p>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-group">
            <label htmlFor="accountName">Account Name (4-16 Characters)</label>
            <input
              id="accountName"
              type="text"
              name="accountName"
              placeholder="Enter account name"
              value={formData.accountName}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cadetName">Cadet Name (2-16 Characters)</label>
            <input
              id="cadetName"
              type="text"
              name="cadetName"
              placeholder="Enter cadet name"
              value={formData.cadetName}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cadetNo">Cadet No. (4 Digits)</label>
            <input
              id="cadetNo"
              type="text"
              name="cadetNo"
              placeholder="Enter 4-digit cadet number"
              value={formData.cadetNo}
              onChange={handleChange}
              disabled={loading}
              maxLength={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password (6+ Characters)</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="batch">Batch</label>
            <select
              id="batch"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Select a batch</option>
              {INTAKES.map((intake) => (
                <option key={intake} value={intake}>
                  {intake}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="text-muted">Already have an account?</p>
          <Link to="/login" className="auth-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  )
}
