

import React from 'react'
import { Auth } from '../pages/Auth'
import { Palier } from '../pages/Palier'
import { PaymentIntake } from '../pages/PaymentIntake'
import { Students } from '../pages/Students'
import { StudentDetail } from '../pages/StudentDetail'

export function Router({
  currentPage,
  user,
  selectedSection,
  selectedClass,
  selectedStudent,
  existingStudent,
  onLogin,
  onSectionSelect,
  onPaymentComplete,
  onViewStudent,
  onContinuePayment,
  navigateTo
}) {
  switch (currentPage) {
    case 'auth':
      return <Auth onLogin={onLogin} />

    case 'palier':
      return <Palier onSectionSelect={onSectionSelect} />

    case 'payment':
      return (
        <PaymentIntake
          section={selectedSection}
          className={selectedClass}
          onPaymentComplete={onPaymentComplete}
          navigateTo={navigateTo}
          user={user}
          existingStudent={existingStudent}
        />
      )

    case 'students':
      return (
        <Students
          onViewStudent={onViewStudent}
          navigateTo={navigateTo}
          onContinuePayment={onContinuePayment}
        />
      )

    case 'student-detail':
      return (
        <StudentDetail
          student={selectedStudent}
          navigateTo={navigateTo}
          onContinuePayment={onContinuePayment}
        />
      )

    default:
      return (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">
              Page non trouvée
            </h2>
            <button
              onClick={() => navigateTo('auth')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      )
  }
}