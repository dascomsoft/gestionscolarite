






import React from 'react'
import { Navbar } from './Navbar'

export function Layout({ children, title, onBack, showBack = true, user, onLogout, navigateTo }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        title={title}
        onBack={onBack}
        showBack={showBack}
        user={user}
        onLogout={onLogout}
        navigateTo={navigateTo}
      />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}