import React, { useState } from 'react'
import { User, Lock, School, Eye, EyeOff } from 'lucide-react'
import { api } from '../lib/api'
import { useEffect } from 'react'
import '../Styles/Auth.css'

export function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Connexion
        const user = await api.login(formData.email, formData.password)
        onLogin(user)
      } else {
        // Création de compte
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas')
          return
        }
        const user = await api.createOperator({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
        onLogin(user)
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() =>{
    window.scrollTo(0,0)
  },[])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="auth-wrapper">
        <div className="auth-header">
          <div className="auth-logo">
            <School className="auth-logo-icon" />
          </div>
          <div className="auth-title-section">
            <h1 className="auth-title">
              Groupe Scolaire Bilingue
            </h1>
            <h2 className="auth-subtitle">
              La Grâce De Dieu
            </h2>
            <p className="auth-description">
              {isLogin ? 'Connectez-vous à votre espace personnel' : 'Créez un nouveau compte opérateur'}
            </p>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h3 className="auth-card-title">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h3>
            <div className="auth-mode-indicator">
              <div className={`mode-slider ${isLogin ? 'login-mode' : 'register-mode'}`}>
                <span>{isLogin ? 'Connexion' : 'Inscription'}</span>
              </div>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Nom complet
                </label>
                <div className="input-container">
                  <User className="input-icon" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Entrez votre nom complet"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Adresse email
              </label>
              <div className="input-container">
                <User className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirmer le mot de passe
                </label>
                <div className="input-container">
                  <Lock className="input-icon" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                <div className="error-icon">!</div>
                <p className="error-text">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Chargement...
                </>
              ) : (
                isLogin ? 'Se connecter' : 'Créer le compte'
              )}
            </button>

            <div className="auth-switch">
              <p className="auth-switch-text">
                {isLogin ? "Pas de compte ?" : "Déjà un compte ?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                }}
                className="auth-switch-button"
              >
                {isLogin ? "Créer un compte" : "Se connecter"}
              </button>
            </div>
          </form>
        </div>

        <div className="auth-footer">
          <p className="footer-text">
            © 2024 Groupe Scolaire Bilingue La Grâce De Dieu. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  )
}