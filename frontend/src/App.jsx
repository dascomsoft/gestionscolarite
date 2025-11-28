


import React, { useState } from 'react'
import { Auth } from './pages/Auth'
import { Palier } from './pages/Palier'
import { PaymentIntake } from './pages/PaymentIntake'
import { Students } from './pages/Students'
import { StudentDetail } from './pages/StudentDetail'
import { Router } from './routes/Router'
import { Layout } from './components/Layout'

function App() {
  const [currentPage, setCurrentPage] = useState('auth')
  const [user, setUser] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [existingStudent, setExistingStudent] = useState(null)

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    navigateTo('palier')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('auth')
    setSelectedSection(null)
    setSelectedClass(null)
    setSelectedStudent(null)
    setExistingStudent(null)
  }

  const handleSectionSelect = (section, className) => {
    setSelectedSection(section)
    setSelectedClass(className)
    setExistingStudent(null)
    navigateTo('payment')
  }

  const handlePaymentComplete = () => {
    setExistingStudent(null)
    navigateTo('students')
  }

  const handleViewStudent = (student) => {
    setSelectedStudent(student)
    navigateTo('student-detail')
  }

  const handleContinuePayment = (student) => {
    // Réinitialiser d'abord pour forcer le rechargement
    setExistingStudent(null)
    setSelectedSection(null)
    setSelectedClass(null)
    
    // Puis remettre les valeurs après un petit délai
    setTimeout(() => {
      setExistingStudent(student)
      setSelectedSection(student.section)
      setSelectedClass(student.class)
      navigateTo('payment')
    }, 10)
  }

  const getPageTitle = () => {
    const titles = {
      'auth': 'Connexion',
      'palier': 'Sélection de la section',
      'payment': existingStudent ? 'Poursuite du paiement' : 'Saisie du paiement',
      'students': 'Liste des élèves',
      'student-detail': 'Détails de l\'élève'
    }
    return titles[currentPage] || 'Gestion Scolarité'
  }

  const showBackButton = currentPage !== 'auth'

  const handleBack = () => {
    if (currentPage === 'student-detail') {
      navigateTo('students')
    } else if (currentPage === 'students') {
      if (existingStudent) {
        setExistingStudent(null)
        navigateTo('student-detail')
      } else {
        navigateTo('payment')
      }
    } else if (currentPage === 'payment') {
      if (existingStudent) {
        setExistingStudent(null)
        navigateTo('student-detail')
      } else {
        navigateTo('palier')
      }
    } else if (currentPage === 'palier') {
      navigateTo('auth')
    }
  }

  return (
    <Layout
      title={getPageTitle()}
      onBack={handleBack}
      showBack={showBackButton && currentPage !== 'auth'}
      user={user}
      onLogout={handleLogout}
      navigateTo={navigateTo}
    >
      <Router
        currentPage={currentPage}
        user={user}
        selectedSection={selectedSection}
        selectedClass={selectedClass}
        selectedStudent={selectedStudent}
        existingStudent={existingStudent}
        onLogin={handleLogin}
        onSectionSelect={handleSectionSelect}
        onPaymentComplete={handlePaymentComplete}
        onViewStudent={handleViewStudent}
        onContinuePayment={handleContinuePayment}
        navigateTo={navigateTo}
      />
    </Layout>
  )
}

export default App


































