


// import React, { useState, useEffect } from 'react'
// import { Search, Eye, User, Calendar, DollarSign, CheckCircle } from 'lucide-react'
// import { api } from '../lib/api'
// import { formatCurrency } from '../lib/format'
// import { getFees } from '../lib/fees'
// import '../Styles/Students.css'

// export function Students({ onViewStudent, navigateTo, onContinuePayment }) {
//   const [students, setStudents] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [studentPayments, setStudentPayments] = useState({})

//   useEffect(() => {
//     loadStudents()
//   }, [])

//   const loadStudents = async () => {
//     try {
//       const data = await api.getStudents()
//       setStudents(data)
      
//       // Charger les paiements pour chaque élève
//       const paymentsData = {}
//       for (const student of data) {
//         try {
//           const payments = await api.getStudentPayments(student.id)
//           paymentsData[student.id] = payments
//         } catch (error) {
//           console.error(`Erreur chargement paiements pour ${student.name}:`, error)
//           paymentsData[student.id] = []
//         }
//       }
//       setStudentPayments(paymentsData)
//     } catch (error) {
//       console.error('Erreur lors du chargement des élèves:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getStudentSchoolYear = (student) => {
//     return student.schoolYear || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
//   }

//   // CORRECTION: Calculer correctement si un élève a soldé sa scolarité
//   const isStudentFullyPaid = (student) => {
//     const payments = studentPayments[student.id] || []
    
//     // Agrégation correcte des montants payés par type de frais
//     const alreadyPaidAmounts = {
//       inscription: 0,
//       pension_0: 0,
//       pension_1: 0,
//       pension_2: 0
//     }
    
//     payments.forEach(payment => {
//       if (payment.paidAmounts) {
//         alreadyPaidAmounts.inscription += payment.paidAmounts.inscription || 0
//         alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
//         alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
//         alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
//       }
//     })
    
//     const fees = getFees(student.section, student.class)
//     if (!fees) return false
    
//     const totalDue = fees.inscription + fees.pension.reduce((sum, item) => sum + item.amount, 0)
//     const totalPaid = Object.values(alreadyPaidAmounts).reduce((sum, amount) => sum + amount, 0)
    
//     // Debug pour vérifier les calculs
//     console.log(`💰 ${student.name}: totalDue=${totalDue}, totalPaid=${totalPaid}, soldé=${totalPaid >= totalDue}`)
//     console.log(`📊 Détails paiements:`, alreadyPaidAmounts)
    
//     return totalPaid >= totalDue
//   }

//   // CORRECTION: Obtenir le statut détaillé de paiement
//   const getPaymentStatus = (student) => {
//     const payments = studentPayments[student.id] || []
    
//     const alreadyPaidAmounts = {
//       inscription: 0,
//       pension_0: 0,
//       pension_1: 0,
//       pension_2: 0
//     }
    
//     payments.forEach(payment => {
//       if (payment.paidAmounts) {
//         alreadyPaidAmounts.inscription += payment.paidAmounts.inscription || 0
//         alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
//         alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
//         alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
//       }
//     })
    
//     const fees = getFees(student.section, student.class)
//     if (!fees) return { isFullyPaid: false, totalDue: 0, totalPaid: 0, remaining: 0 }
    
//     const totalDue = fees.inscription + fees.pension.reduce((sum, item) => sum + item.amount, 0)
//     const totalPaid = Object.values(alreadyPaidAmounts).reduce((sum, amount) => sum + amount, 0)
//     const remaining = totalDue - totalPaid
    
//     return {
//       isFullyPaid: totalPaid >= totalDue,
//       totalDue,
//       totalPaid,
//       remaining,
//       alreadyPaidAmounts
//     }
//   }

//   const filteredStudents = students.filter(student =>
//     student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     student.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const handleContinuePayment = (student) => {
//     if (onContinuePayment) {
//       onContinuePayment(student)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="students-loading">
//         <div className="loading-content">
//           <div className="loading-spinner"></div>
//           <p className="loading-text">Chargement des élèves...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="students-container">
//       <div className="students-content">
//         <div className="students-header">
//           <div className="header-content">
//             <div className="header-titles">
//               <h1 className="main-title">Élèves enregistrés</h1>
//               <p className="students-count">
//                 {filteredStudents.length} élève{filteredStudents.length !== 1 ? 's' : ''} trouvé{filteredStudents.length !== 1 ? 's' : ''}
//               </p>
//             </div>
            
//             <div className="search-container">
//               <Search className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Rechercher un élève..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input"
//               />
//             </div>
//           </div>
//         </div>

//         {filteredStudents.length === 0 ? (
//           <div className="empty-state">
//             <User className="empty-icon" />
//             <h3 className="empty-title">Aucun élève trouvé</h3>
//             <p className="empty-description">
//               {searchTerm ? 'Aucun élève ne correspond à votre recherche.' : 'Aucun élève n\'a été enregistré pour le moment.'}
//             </p>
//             {!searchTerm && (
//               <button
//                 onClick={() => navigateTo('payment')}
//                 className="empty-button"
//               >
//                 Commencer un nouveau paiement
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="students-table-container">
//             <div className="table-wrapper">
//               <table className="students-table">
//                 <thead className="table-header">
//                   <tr>
//                     <th className="table-head">Élève</th>
//                     <th className="table-head">Classe</th>
//                     <th className="table-head">Matricule</th>
//                     <th className="table-head">Section</th>
//                     <th className="table-head">Année scolaire</th>
//                     <th className="table-head">Statut</th>
//                     <th className="table-head actions-head">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="table-body">
//                   {filteredStudents.map((student) => {
//                     const paymentStatus = getPaymentStatus(student)
//                     const isFullyPaid = paymentStatus.isFullyPaid
                    
//                     return (
//                     <tr key={student.id} className="table-row">
//                       <td className="student-cell">
//                         <div className="student-info">
//                           <div className="student-avatar">
//                             <User className="avatar-icon" />
//                           </div>
//                           <div className="student-details">
//                             <div className="student-name">
//                               {student.name}
//                             </div>
//                             {isFullyPaid && (
//                               <div className="payment-detail">
//                                 Total payé: {formatCurrency(paymentStatus.totalPaid)}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="class-cell">
//                         <span className="class-badge">
//                           {student.class}
//                         </span>
//                       </td>
//                       <td className="matricule-cell">
//                         {student.matricule || 'N/A'}
//                       </td>
//                       <td className="section-cell">
//                         {student.section === 'im1' ? 'Francophone' : 'Anglophone'}
//                       </td>
//                       <td className="year-cell">
//                         <div className="year-info">
//                           <Calendar className="year-icon" />
//                           {getStudentSchoolYear(student)}
//                         </div>
//                       </td>
//                       <td className="status-cell">
//                         {isFullyPaid ? (
//                           <div className="status-badge fully-paid">
//                             <CheckCircle className="status-icon" />
//                             SOLDÉ
//                           </div>
//                         ) : (
//                           <div className="status-badge pending">
//                             Reste: {formatCurrency(paymentStatus.remaining)}
//                           </div>
//                         )}
//                       </td>
//                       <td className="actions-cell">
//                         <div className="action-buttons">
//                           <button
//                             onClick={() => onViewStudent(student)}
//                             className="view-button"
//                           >
//                             <Eye className="view-icon" />
//                             Voir détail
//                           </button>
//                           {!isFullyPaid ? (
//                             <button
//                               onClick={() => handleContinuePayment(student)}
//                               className="continue-payment-button"
//                             >
//                               <DollarSign className="button-icon" />
//                               Poursuivre paiement
//                             </button>
//                           ) : (
//                             <div className="fully-paid-indicator">
//                               <CheckCircle className="button-icon" />
//                               Scolarité soldée
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   )})}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         <div className="actions-footer">
//           <button
//             onClick={() => navigateTo('payment')}
//             className="footer-button secondary"
//           >
//             Nouveau paiement
//           </button>
//           <button
//             onClick={() => navigateTo('palier')}
//             className="footer-button primary"
//           >
//             Changer de classe
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }






































































import React, { useState, useEffect } from 'react'
import { Search, Eye, User, Calendar, DollarSign, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'
import { formatCurrency } from '../lib/format'
import { getFees } from '../lib/fees'
import '../Styles/Students.css'

export function Students({ onViewStudent, navigateTo, onContinuePayment }) {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [studentPayments, setStudentPayments] = useState({})

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = async () => {
    try {
      const data = await api.getStudents()
      setStudents(data)
      
      // Charger les paiements pour chaque élève
      const paymentsData = {}
      for (const student of data) {
        try {
          const payments = await api.getStudentPayments(student.id)
          paymentsData[student.id] = payments
        } catch (error) {
          console.error(`Erreur chargement paiements pour ${student.name}:`, error)
          paymentsData[student.id] = []
        }
      }
      setStudentPayments(paymentsData)
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStudentSchoolYear = (student) => {
    return student.schoolYear || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
  }

  // CORRECTION: Inclure fraisAnnexes dans les calculs
  const isStudentFullyPaid = (student) => {
    const payments = studentPayments[student.id] || []
    
    // CORRECTION: Ajouter fraisAnnexes
    const alreadyPaidAmounts = {
      inscription: 0,
      fraisAnnexes: 0,
      pension_0: 0,
      pension_1: 0,
      pension_2: 0
    }
    
    payments.forEach(payment => {
      if (payment.paidAmounts) {
        alreadyPaidAmounts.inscription += payment.paidAmounts.inscription || 0
        alreadyPaidAmounts.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0 // AJOUT
        alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
        alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
        alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
      }
    })
    
    const fees = getFees(student.section, student.class)
    if (!fees) return false
    
    // CORRECTION: Inclure fraisAnnexes dans totalDue
    const totalDue = fees.inscription + (fees.fraisAnnexes || 0) + fees.pension.reduce((sum, item) => sum + item.amount, 0)
    const totalPaid = Object.values(alreadyPaidAmounts).reduce((sum, amount) => sum + amount, 0)
    
    // Debug pour vérifier les calculs
    console.log(`💰 ${student.name}: totalDue=${totalDue}, totalPaid=${totalPaid}, soldé=${totalPaid >= totalDue}`)
    console.log(`📊 Détails paiements:`, alreadyPaidAmounts)
    
    return totalPaid >= totalDue
  }

  // CORRECTION: Inclure fraisAnnexes dans getPaymentStatus
  const getPaymentStatus = (student) => {
    const payments = studentPayments[student.id] || []
    
    const alreadyPaidAmounts = {
      inscription: 0,
      fraisAnnexes: 0, // AJOUT
      pension_0: 0,
      pension_1: 0,
      pension_2: 0
    }
    
    payments.forEach(payment => {
      if (payment.paidAmounts) {
        alreadyPaidAmounts.inscription += payment.paidAmounts.inscription || 0
        alreadyPaidAmounts.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0 // AJOUT
        alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
        alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
        alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
      }
    })
    
    const fees = getFees(student.section, student.class)
    if (!fees) return { isFullyPaid: false, totalDue: 0, totalPaid: 0, remaining: 0 }
    
    // CORRECTION: Inclure fraisAnnexes dans totalDue
    const totalDue = fees.inscription + (fees.fraisAnnexes || 0) + fees.pension.reduce((sum, item) => sum + item.amount, 0)
    const totalPaid = Object.values(alreadyPaidAmounts).reduce((sum, amount) => sum + amount, 0)
    const remaining = totalDue - totalPaid
    
    return {
      isFullyPaid: totalPaid >= totalDue,
      totalDue,
      totalPaid,
      remaining,
      alreadyPaidAmounts
    }
  }

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleContinuePayment = (student) => {
    if (onContinuePayment) {
      onContinuePayment(student)
    }
  }

  if (loading) {
    return (
      <div className="students-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Chargement des élèves...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="students-container">
      <div className="students-content">
        <div className="students-header">
          <div className="header-content">
            <div className="header-titles">
              <h1 className="main-title">Élèves enregistrés</h1>
              <p className="students-count">
                {filteredStudents.length} élève{filteredStudents.length !== 1 ? 's' : ''} trouvé{filteredStudents.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un élève..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <User className="empty-icon" />
            <h3 className="empty-title">Aucun élève trouvé</h3>
            <p className="empty-description">
              {searchTerm ? 'Aucun élève ne correspond à votre recherche.' : 'Aucun élève n\'a été enregistré pour le moment.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigateTo('payment')}
                className="empty-button"
              >
                Commencer un nouveau paiement
              </button>
            )}
          </div>
        ) : (
          <div className="students-table-container">
            <div className="table-wrapper">
              <table className="students-table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">Élève</th>
                    <th className="table-head">Classe</th>
                    <th className="table-head">Matricule</th>
                    <th className="table-head">Section</th>
                    <th className="table-head">Année scolaire</th>
                    <th className="table-head">Statut</th>
                    <th className="table-head actions-head">Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredStudents.map((student) => {
                    const paymentStatus = getPaymentStatus(student)
                    const isFullyPaid = paymentStatus.isFullyPaid
                    
                    return (
                    <tr key={student.id} className="table-row">
                      <td className="student-cell">
                        <div className="student-info">
                          <div className="student-avatar">
                            <User className="avatar-icon" />
                          </div>
                          <div className="student-details">
                            <div className="student-name">
                              {student.name}
                            </div>
                            {isFullyPaid && (
                              <div className="payment-detail">
                                Total payé: {formatCurrency(paymentStatus.totalPaid)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="class-cell">
                        <span className="class-badge">
                          {student.class}
                        </span>
                      </td>
                      <td className="matricule-cell">
                        {student.matricule || 'N/A'}
                      </td>
                      <td className="section-cell">
                        {student.section === 'im1' ? 'Francophone' : 'Anglophone'}
                      </td>
                      <td className="year-cell">
                        <div className="year-info">
                          <Calendar className="year-icon" />
                          {getStudentSchoolYear(student)}
                        </div>
                      </td>
                      <td className="status-cell">
                        {isFullyPaid ? (
                          <div className="status-badge fully-paid">
                            <CheckCircle className="status-icon" />
                            SOLDÉ
                          </div>
                        ) : (
                          <div className="status-badge pending">
                            Reste: {formatCurrency(paymentStatus.remaining)}
                          </div>
                        )}
                      </td>
                      <td className="actions-cell">
                        <div className="action-buttons">
                          <button
                            onClick={() => onViewStudent(student)}
                            className="view-button"
                          >
                            <Eye className="view-icon" />
                            Voir détail
                          </button>
                          {!isFullyPaid ? (
                            <button
                              onClick={() => handleContinuePayment(student)}
                              className="continue-payment-button"
                            >
                              <DollarSign className="button-icon" />
                              Poursuivre paiement
                            </button>
                          ) : (
                            <div className="fully-paid-indicator">
                              <CheckCircle className="button-icon" />
                              Scolarité soldée
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="actions-footer">
          <button
            onClick={() => navigateTo('payment')}
            className="footer-button secondary"
          >
            Nouveau paiement
          </button>
          <button
            onClick={() => navigateTo('palier')}
            className="footer-button primary"
          >
            Changer de classe
          </button>
        </div>
      </div>
    </div>
  )
}