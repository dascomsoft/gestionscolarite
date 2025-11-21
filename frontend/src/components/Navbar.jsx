




import React from 'react'
import { ArrowLeft, User, LogOut, Home, Users } from 'lucide-react'
import '../Styles/Navbar.css'

export function Navbar({ title, onBack, showBack = true, user, onLogout, navigateTo }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="back-button"
            >
              <ArrowLeft className="back-icon" />
            </button>
          )}
          <div className="title-container">
            <h1 className="navbar-title">{title}</h1>
            <p className="navbar-subtitle">Groupe Scolaire Bilingue La Grace De Dieu</p>
          </div>
        </div>

        <div className="navbar-right">
          {/* Liens de navigation rapide */}
          {user && navigateTo && (
            <>
              <button
                onClick={() => navigateTo('palier')}
                className="nav-link"
                title="Accueil"
              >
                <Home className="nav-icon" />
                <span>Accueil</span>
              </button>
              <button
                onClick={() => navigateTo('students')}
                className="nav-link"
                title="Liste des élèves"
              >
                <Users className="nav-icon" />
                <span>Élèves</span>
              </button>
            </>
          )}

          {user && onLogout && (
            <button
              onClick={onLogout}
              className="logout-button"
              title="Déconnexion"
            >
              <LogOut className="logout-icon" />
              <span>Déconnexion</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}






