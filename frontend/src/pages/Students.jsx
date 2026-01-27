

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

//   // CORRECTION: Inclure fraisAnnexes dans les calculs
//   const isStudentFullyPaid = (student) => {
//     const payments = studentPayments[student.id] || []
    
//     // CORRECTION: Ajouter fraisAnnexes
//     const alreadyPaidAmounts = {
//       inscription: 0,
//       fraisAnnexes: 0,
//       pension_0: 0,
//       pension_1: 0,
//       pension_2: 0
//     }
    
//     payments.forEach(payment => {
//       if (payment.paidAmounts) {
//         alreadyPaidAmounts.inscription += payment.paidAmounts.inscription || 0
//         alreadyPaidAmounts.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0 // AJOUT
//         alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
//         alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
//         alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
//       }
//     })
    
//     const fees = getFees(student.section, student.class)
//     if (!fees) return false
    
//     // CORRECTION: Inclure fraisAnnexes dans totalDue
//     const totalDue = fees.inscription + (fees.fraisAnnexes || 0) + fees.pension.reduce((sum, item) => sum + item.amount, 0)
//     const totalPaid = Object.values(alreadyPaidAmounts).reduce((sum, amount) => sum + amount, 0)
    
//     // Debug pour vérifier les calculs
//     console.log(`💰 ${student.name}: totalDue=${totalDue}, totalPaid=${totalPaid}, soldé=${totalPaid >= totalDue}`)
//     console.log(`📊 Détails paiements:`, alreadyPaidAmounts)
    
//     return totalPaid >= totalDue
//   }

//   // CORRECTION: Inclure fraisAnnexes dans getPaymentStatus
//   const getPaymentStatus = (student) => {
//     const payments = studentPayments[student.id] || []
    
//     const alreadyPaidAmounts = {
//       inscription: 0,
//       fraisAnnexes: 0, // AJOUT
//       pension_0: 0,
//       pension_1: 0,
//       pension_2: 0
//     }
    
//     payments.forEach(payment => {
//       if (payment.paidAmounts) {
//         alreadyPaidAmounts.inscription += payment.paidAmounts.inscription || 0
//         alreadyPaidAmounts.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0 // AJOUT
//         alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
//         alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
//         alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
//       }
//     })
    
//     const fees = getFees(student.section, student.class)
//     if (!fees) return { isFullyPaid: false, totalDue: 0, totalPaid: 0, remaining: 0 }
    
//     // CORRECTION: Inclure fraisAnnexes dans totalDue
//     const totalDue = fees.inscription + (fees.fraisAnnexes || 0) + fees.pension.reduce((sum, item) => sum + item.amount, 0)
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


















































































































// import React, { useState, useEffect } from 'react'
// import { Search, Eye, User, Calendar, DollarSign, CheckCircle, Globe, BookOpen } from 'lucide-react'
// import { api } from '../lib/api'
// import { formatCurrency } from '../lib/format'
// import { getFees } from '../lib/fees'
// import '../Styles/Students.css'

// export function Students({ onViewStudent, navigateTo, onContinuePayment }) {
//   const [students, setStudents] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [studentPayments, setStudentPayments] = useState({})
//   const [activeSection, setActiveSection] = useState('all') // 'all', 'im1', 'im2'

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

//   const isStudentFullyPaid = (student) => {
//     const payments = studentPayments[student.id] || []
    
//     const alreadyPaidAmounts = {
//       inscription: 0,
//       fraisAnnexes: 0,
//       pension_0: 0,
//       pension_1: 0,
//       pension_2: 0
//     }
    
//     payments.forEach(payment => {
//       if (payment.paidAmounts) {
//         alreadyPaidAmounts.inscription += payment.paidAmounts.inscription || 0
//         alreadyPaidAmounts.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0
//         alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
//         alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
//         alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
//       }
//     })
    
//     const fees = getFees(student.section, student.class)
//     if (!fees) return false
    
//     const totalDue = fees.inscription + (fees.fraisAnnexes || 0) + fees.pension.reduce((sum, item) => sum + item.amount, 0)
//     const totalPaid = Object.values(alreadyPaidAmounts).reduce((sum, amount) => sum + amount, 0)
    
//     return totalPaid >= totalDue
//   }

//   const getPaymentStatus = (student) => {
//     const payments = studentPayments[student.id] || []
    
//     const alreadyPaidAmounts = {
//       inscription: 0,
//       fraisAnnexes: 0,
//       pension_0: 0,
//       pension_1: 0,
//       pension_2: 0
//     }
    
//     payments.forEach(payment => {
//       if (payment.paidAmounts) {
//         alreadyPaidAmounts.inscription += payment.paidAmounts.inscription || 0
//         alreadyPaidAmounts.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0
//         alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
//         alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
//         alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
//       }
//     })
    
//     const fees = getFees(student.section, student.class)
//     if (!fees) return { isFullyPaid: false, totalDue: 0, totalPaid: 0, remaining: 0 }
    
//     const totalDue = fees.inscription + (fees.fraisAnnexes || 0) + fees.pension.reduce((sum, item) => sum + item.amount, 0)
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

//   // Filtrer les élèves par section et recherche
//   const getFilteredStudents = () => {
//     return students.filter(student => {
//       // Filtre par section
//       const sectionMatch = activeSection === 'all' || student.section === activeSection
      
//       // Filtre par recherche
//       const searchMatch = 
//         student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         student.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
      
//       return sectionMatch && searchMatch
//     })
//   }

//   // Grouper les élèves par section
//   const studentsBySection = {
//     im1: getFilteredStudents().filter(s => s.section === 'im1'),
//     im2: getFilteredStudents().filter(s => s.section === 'im2')
//   }

//   const handleContinuePayment = (student) => {
//     if (onContinuePayment) {
//       onContinuePayment(student)
//     }
//   }

//   // Statistiques par section
//   const sectionStats = {
//     im1: {
//       count: studentsBySection.im1.length,
//       fullyPaid: studentsBySection.im1.filter(s => isStudentFullyPaid(s)).length,
//       total: students.filter(s => s.section === 'im1').length
//     },
//     im2: {
//       count: studentsBySection.im2.length,
//       fullyPaid: studentsBySection.im2.filter(s => isStudentFullyPaid(s)).length,
//       total: students.filter(s => s.section === 'im2').length
//     },
//     all: {
//       count: getFilteredStudents().length,
//       fullyPaid: getFilteredStudents().filter(s => isStudentFullyPaid(s)).length,
//       total: students.length
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
//                 {sectionStats.all.count} élève{sectionStats.all.count !== 1 ? 's' : ''} trouvé{sectionStats.all.count !== 1 ? 's' : ''}
//                 {activeSection !== 'all' && (
//                   <span className="section-filter-indicator">
//                     • {activeSection === 'im1' ? 'Francophone' : 'Anglophone'}
//                   </span>
//                 )}
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

//         {/* Sélecteur de section */}
//         <div className="section-selector">
//           <div className="section-tabs">
//             <button
//               className={`section-tab ${activeSection === 'all' ? 'active' : ''}`}
//               onClick={() => setActiveSection('all')}
//             >
//               <Globe className="tab-icon" />
//               Tous les élèves
//               <span className="tab-count">{sectionStats.all.total}</span>
//             </button>
            
//             <button
//               className={`section-tab ${activeSection === 'im1' ? 'active' : ''}`}
//               onClick={() => setActiveSection('im1')}
//             >
//               <BookOpen className="tab-icon" />
//               Section francophone
//               <span className="tab-count">{sectionStats.im1.total}</span>
//               <span className="tab-paid">{sectionStats.im1.fullyPaid} soldés</span>
//             </button>
            
//             <button
//               className={`section-tab ${activeSection === 'im2' ? 'active' : ''}`}
//               onClick={() => setActiveSection('im2')}
//             >
//               <Globe className="tab-icon" />
//               Section anglophone
//               <span className="tab-count">{sectionStats.im2.total}</span>
//               <span className="tab-paid">{sectionStats.im2.fullyPaid} soldés</span>
//             </button>
//           </div>
//         </div>

//         {getFilteredStudents().length === 0 ? (
//           <div className="empty-state">
//             <User className="empty-icon" />
//             <h3 className="empty-title">Aucun élève trouvé</h3>
//             <p className="empty-description">
//               {searchTerm 
//                 ? `Aucun élève ne correspond à votre recherche${activeSection !== 'all' ? ` dans la section ${activeSection === 'im1' ? 'francophone' : 'anglophone'}` : ''}.`
//                 : activeSection !== 'all' 
//                   ? `Aucun élève n'a été enregistré dans la section ${activeSection === 'im1' ? 'francophone' : 'anglophone'}.`
//                   : 'Aucun élève n\'a été enregistré pour le moment.'}
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
//           <div className="students-sections-container">
//             {/* Affichage par section */}
//             {activeSection === 'all' ? (
//               // Afficher les deux sections séparément
//               <>
//                 {/* Section francophone */}
//                 {studentsBySection.im1.length > 0 && (
//                   <div className="section-group">
//                     <div className="section-header">
//                       <BookOpen className="section-icon" />
//                       <h2 className="section-title">Section francophone</h2>
//                       <span className="section-stats">
//                         {studentsBySection.im1.length} élève{studentsBySection.im1.length !== 1 ? 's' : ''}
//                         <span className="section-paid">
//                           • {studentsBySection.im1.filter(s => isStudentFullyPaid(s)).length} soldés
//                         </span>
//                       </span>
//                     </div>
                    
//                     <div className="students-table-container">
//                       <div className="table-wrapper">
//                         <table className="students-table">
//                           <thead className="table-header">
//                             <tr>
//                               <th className="table-head">Élève</th>
//                               <th className="table-head">Classe</th>
//                               <th className="table-head">Matricule</th>
//                               <th className="table-head">Année scolaire</th>
//                               <th className="table-head">Statut</th>
//                               <th className="table-head actions-head">Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody className="table-body">
//                             {studentsBySection.im1.map((student) => {
//                               const paymentStatus = getPaymentStatus(student)
//                               const isFullyPaid = paymentStatus.isFullyPaid
                              
//                               return (
//                                 <tr key={student.id} className="table-row">
//                                   <td className="student-cell">
//                                     <div className="student-info">
//                                       <div className="student-avatar">
//                                         <User className="avatar-icon" />
//                                       </div>
//                                       <div className="student-details">
//                                         <div className="student-name">
//                                           {student.name}
//                                         </div>
//                                         {isFullyPaid && (
//                                           <div className="payment-detail">
//                                             Total payé: {formatCurrency(paymentStatus.totalPaid)}
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </td>
//                                   <td className="class-cell">
//                                     <span className="class-badge">
//                                       {student.class}
//                                     </span>
//                                   </td>
//                                   <td className="matricule-cell">
//                                     {student.matricule || 'N/A'}
//                                   </td>
//                                   <td className="year-cell">
//                                     <div className="year-info">
//                                       <Calendar className="year-icon" />
//                                       {getStudentSchoolYear(student)}
//                                     </div>
//                                   </td>
//                                   <td className="status-cell">
//                                     {isFullyPaid ? (
//                                       <div className="status-badge fully-paid">
//                                         <CheckCircle className="status-icon" />
//                                         SOLDÉ
//                                       </div>
//                                     ) : (
//                                       <div className="status-badge pending">
//                                         Reste: {formatCurrency(paymentStatus.remaining)}
//                                       </div>
//                                     )}
//                                   </td>
//                                   <td className="actions-cell">
//                                     <div className="action-buttons">
//                                       <button
//                                         onClick={() => onViewStudent(student)}
//                                         className="view-button"
//                                       >
//                                         <Eye className="view-icon" />
//                                         Voir détail
//                                       </button>
//                                       {!isFullyPaid ? (
//                                         <button
//                                           onClick={() => handleContinuePayment(student)}
//                                           className="continue-payment-button"
//                                         >
//                                           <DollarSign className="button-icon" />
//                                           Poursuivre paiement
//                                         </button>
//                                       ) : (
//                                         <div className="fully-paid-indicator">
//                                           <CheckCircle className="button-icon" />
//                                           Scolarité soldée
//                                         </div>
//                                       )}
//                                     </div>
//                                   </td>
//                                 </tr>
//                               )
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Section anglophone */}
//                 {studentsBySection.im2.length > 0 && (
//                   <div className="section-group">
//                     <div className="section-header">
//                       <Globe className="section-icon" />
//                       <h2 className="section-title">Section anglophone</h2>
//                       <span className="section-stats">
//                         {studentsBySection.im2.length} élève{studentsBySection.im2.length !== 1 ? 's' : ''}
//                         <span className="section-paid">
//                           • {studentsBySection.im2.filter(s => isStudentFullyPaid(s)).length} soldés
//                         </span>
//                       </span>
//                     </div>
                    
//                     <div className="students-table-container">
//                       <div className="table-wrapper">
//                         <table className="students-table">
//                           <thead className="table-header">
//                             <tr>
//                               <th className="table-head">Élève</th>
//                               <th className="table-head">Classe</th>
//                               <th className="table-head">Matricule</th>
//                               <th className="table-head">Année scolaire</th>
//                               <th className="table-head">Statut</th>
//                               <th className="table-head actions-head">Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody className="table-body">
//                             {studentsBySection.im2.map((student) => {
//                               const paymentStatus = getPaymentStatus(student)
//                               const isFullyPaid = paymentStatus.isFullyPaid
                              
//                               return (
//                                 <tr key={student.id} className="table-row">
//                                   <td className="student-cell">
//                                     <div className="student-info">
//                                       <div className="student-avatar">
//                                         <User className="avatar-icon" />
//                                       </div>
//                                       <div className="student-details">
//                                         <div className="student-name">
//                                           {student.name}
//                                         </div>
//                                         {isFullyPaid && (
//                                           <div className="payment-detail">
//                                             Total payé: {formatCurrency(paymentStatus.totalPaid)}
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </td>
//                                   <td className="class-cell">
//                                     <span className="class-badge">
//                                       {student.class}
//                                     </span>
//                                   </td>
//                                   <td className="matricule-cell">
//                                     {student.matricule || 'N/A'}
//                                   </td>
//                                   <td className="year-cell">
//                                     <div className="year-info">
//                                       <Calendar className="year-icon" />
//                                       {getStudentSchoolYear(student)}
//                                     </div>
//                                   </td>
//                                   <td className="status-cell">
//                                     {isFullyPaid ? (
//                                       <div className="status-badge fully-paid">
//                                         <CheckCircle className="status-icon" />
//                                         SOLDÉ
//                                       </div>
//                                     ) : (
//                                       <div className="status-badge pending">
//                                         Reste: {formatCurrency(paymentStatus.remaining)}
//                                       </div>
//                                     )}
//                                   </td>
//                                   <td className="actions-cell">
//                                     <div className="action-buttons">
//                                       <button
//                                         onClick={() => onViewStudent(student)}
//                                         className="view-button"
//                                       >
//                                         <Eye className="view-icon" />
//                                         Voir détail
//                                       </button>
//                                       {!isFullyPaid ? (
//                                         <button
//                                           onClick={() => handleContinuePayment(student)}
//                                           className="continue-payment-button"
//                                         >
//                                           <DollarSign className="button-icon" />
//                                           Poursuivre paiement
//                                         </button>
//                                       ) : (
//                                         <div className="fully-paid-indicator">
//                                           <CheckCircle className="button-icon" />
//                                           Scolarité soldée
//                                         </div>
//                                       )}
//                                     </div>
//                                   </td>
//                                 </tr>
//                               )
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             ) : (
//               // Afficher une seule section
//               <div className="students-table-container">
//                 <div className="table-wrapper">
//                   <table className="students-table">
//                     <thead className="table-header">
//                       <tr>
//                         <th className="table-head">Élève</th>
//                         <th className="table-head">Classe</th>
//                         <th className="table-head">Matricule</th>
//                         <th className="table-head">Année scolaire</th>
//                         <th className="table-head">Statut</th>
//                         <th className="table-head actions-head">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody className="table-body">
//                       {getFilteredStudents().map((student) => {
//                         const paymentStatus = getPaymentStatus(student)
//                         const isFullyPaid = paymentStatus.isFullyPaid
                        
//                         return (
//                           <tr key={student.id} className="table-row">
//                             <td className="student-cell">
//                               <div className="student-info">
//                                 <div className="student-avatar">
//                                   <User className="avatar-icon" />
//                                 </div>
//                                 <div className="student-details">
//                                   <div className="student-name">
//                                     {student.name}
//                                   </div>
//                                   {isFullyPaid && (
//                                     <div className="payment-detail">
//                                       Total payé: {formatCurrency(paymentStatus.totalPaid)}
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="class-cell">
//                               <span className="class-badge">
//                                 {student.class}
//                               </span>
//                             </td>
//                             <td className="matricule-cell">
//                               {student.matricule || 'N/A'}
//                             </td>
//                             <td className="year-cell">
//                               <div className="year-info">
//                                 <Calendar className="year-icon" />
//                                 {getStudentSchoolYear(student)}
//                               </div>
//                             </td>
//                             <td className="status-cell">
//                               {isFullyPaid ? (
//                                 <div className="status-badge fully-paid">
//                                   <CheckCircle className="status-icon" />
//                                   SOLDÉ
//                                 </div>
//                               ) : (
//                                 <div className="status-badge pending">
//                                   Reste: {formatCurrency(paymentStatus.remaining)}
//                                 </div>
//                               )}
//                             </td>
//                             <td className="actions-cell">
//                               <div className="action-buttons">
//                                 <button
//                                   onClick={() => onViewStudent(student)}
//                                   className="view-button"
//                                 >
//                                   <Eye className="view-icon" />
//                                   Voir détail
//                                 </button>
//                                 {!isFullyPaid ? (
//                                   <button
//                                     onClick={() => handleContinuePayment(student)}
//                                     className="continue-payment-button"
//                                   >
//                                     <DollarSign className="button-icon" />
//                                     Poursuivre paiement
//                                   </button>
//                                 ) : (
//                                   <div className="fully-paid-indicator">
//                                     <CheckCircle className="button-icon" />
//                                     Scolarité soldée
//                                   </div>
//                                 )}
//                               </div>
//                             </td>
//                           </tr>
//                         )
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
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

















































































// import React, { useState, useEffect } from 'react'
// import { Search, Eye, User, Calendar, DollarSign, CheckCircle, Globe, BookOpen, Printer } from 'lucide-react'
// import { formatCurrency } from '../lib/format'
// import { getFees } from '../lib/fees'
// import '../Styles/Students.css'

// export function Students({ onViewStudent, navigateTo, onContinuePayment }) {
//   const [students, setStudents] = useState([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [studentPayments, setStudentPayments] = useState({})
//   const [activeSection, setActiveSection] = useState('all') // 'all', 'im1', 'im2'

//   useEffect(() => {
//     loadStudents()
//   }, [])

//   const loadStudents = async () => {
//     try {
//       const result = await window.electronAPI.database.invoke('getStudents')
      
//       if (result.success) {
//         setStudents(result.result || [])
        
//         // Charger les paiements pour chaque élève
//         const paymentsData = {}
//         for (const student of result.result) {
//           try {
//             const paymentsResult = await window.electronAPI.database.invoke('getStudentPayments', student.id)
//             if (paymentsResult.success) {
//               paymentsData[student.id] = paymentsResult.result || []
//             }
//           } catch (error) {
//             console.error(`Erreur chargement paiements pour ${student.name}:`, error)
//             paymentsData[student.id] = []
//           }
//         }
//         setStudentPayments(paymentsData)
//       } else {
//         throw new Error(result.error)
//       }
//     } catch (error) {
//       console.error('Erreur lors du chargement des élèves:', error)
//       setStudents([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getStudentSchoolYear = (student) => {
//     return student.schoolYear || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`
//   }

//   const getPaymentStatus = (student) => {
//     const payments = studentPayments[student.id] || []
    
//     const alreadyPaidAmounts = {
//       inscription: 0,
//       fraisAnnexes: 0,
//       pension_0: 0,
//       pension_1: 0,
//       pension_2: 0
//     }
    
//     payments.forEach(payment => {
//       if (payment.paidAmounts) {
//         alreadyPaidAmounts.inscription += payment.paidAmounts.inscription || 0
//         alreadyPaidAmounts.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0
//         alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
//         alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
//         alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
//       }
//     })
    
//     const fees = getFees(student.section, student.class)
//     if (!fees) return { isFullyPaid: false, totalDue: 0, totalPaid: 0, remaining: 0 }
    
//     const totalDue = fees.inscription + (fees.fraisAnnexes || 0) + fees.pension.reduce((sum, item) => sum + item.amount, 0)
//     const totalPaid = Object.values(alreadyPaidAmounts).reduce((sum, amount) => sum + amount, 0)
//     const remaining = Math.max(0, totalDue - totalPaid)
    
//     return {
//       isFullyPaid: totalPaid >= totalDue,
//       totalDue,
//       totalPaid,
//       remaining,
//       alreadyPaidAmounts
//     }
//   }

//   const isStudentFullyPaid = (student) => {
//     return getPaymentStatus(student).isFullyPaid
//   }

//   // Grouper les élèves par classe
//   const groupStudentsByClass = (studentsList) => {
//     const grouped = {}
    
//     studentsList.forEach(student => {
//       if (!grouped[student.class]) {
//         grouped[student.class] = []
//       }
//       grouped[student.class].push(student)
//     })
    
//     // Trier les classes par ordre alphabétique
//     return Object.keys(grouped)
//       .sort()
//       .reduce((sorted, className) => {
//         sorted[className] = grouped[className]
//         return sorted
//       }, {})
//   }

//   // Filtrer les élèves par section et recherche
//   const getFilteredStudents = () => {
//     return students.filter(student => {
//       const sectionMatch = activeSection === 'all' || student.section === activeSection
      
//       const searchMatch = 
//         student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (student.matricule && student.matricule.toLowerCase().includes(searchTerm.toLowerCase()))
      
//       return sectionMatch && searchMatch
//     })
//   }

//   // Grouper les élèves par section et classe
//   const getStudentsGroupedBySectionAndClass = () => {
//     const filtered = getFilteredStudents()
//     const grouped = {
//       im1: groupStudentsByClass(filtered.filter(s => s.section === 'im1')),
//       im2: groupStudentsByClass(filtered.filter(s => s.section === 'im2'))
//     }
    
//     return grouped
//   }

//   const handleContinuePayment = (student) => {
//     if (onContinuePayment) {
//       onContinuePayment(student)
//     }
//   }

//   const handlePrintClassList = (className, sectionStudents) => {
//     const printContent = `
//       <html>
//         <head>
//           <title>Liste des élèves - ${className}</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             .header { text-align: center; margin-bottom: 30px; }
//             .header h1 { color: #333; margin-bottom: 5px; }
//             .header .subtitle { color: #666; }
//             .class-info { margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th { background: #4a90e2; color: white; padding: 10px; text-align: left; }
//             td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
//             .status-paid { color: green; font-weight: bold; }
//             .status-pending { color: #e67e22; }
//             .section-title { margin: 20px 0 10px 0; color: #2c3e50; }
//             .print-date { text-align: right; color: #666; margin-bottom: 20px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>GROUPE SCOLAIRE BILINGUE LA GRÂCE DE DIEU</h1>
//             <div class="subtitle">Liste des élèves - ${className}</div>
//             <div class="print-date">Imprimé le ${new Date().toLocaleDateString()}</div>
//           </div>
          
//           <div class="class-info">
//             <strong>Classe:</strong> ${className}<br>
//             <strong>Nombre d'élèves:</strong> ${sectionStudents.length}
//           </div>
          
//           <table>
//             <thead>
//               <tr>
//                 <th>N°</th>
//                 <th>Nom de l'élève</th>
//                 <th>Matricule</th>
//                 <th>Année scolaire</th>
//                 <th>Statut paiement</th>
//                 <th>Total payé</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${sectionStudents.map((student, index) => {
//                 const paymentStatus = getPaymentStatus(student)
//                 return `
//                   <tr>
//                     <td>${index + 1}</td>
//                     <td>${student.name}</td>
//                     <td>${student.matricule || 'N/A'}</td>
//                     <td>${getStudentSchoolYear(student)}</td>
//                     <td class="${paymentStatus.isFullyPaid ? 'status-paid' : 'status-pending'}">
//                       ${paymentStatus.isFullyPaid ? 'SOLDÉ' : `Reste: ${formatCurrency(paymentStatus.remaining)}`}
//                     </td>
//                     <td>${formatCurrency(paymentStatus.totalPaid)}</td>
//                   </tr>
//                 `
//               }).join('')}
//             </tbody>
//           </table>
          
//           <div style="margin-top: 30px; text-align: center; color: #666;">
//             <p>Total élèves: ${sectionStudents.length} | 
//                Soldés: ${sectionStudents.filter(s => isStudentFullyPaid(s)).length} | 
//                En cours: ${sectionStudents.filter(s => !isStudentFullyPaid(s)).length}</p>
//           </div>
//         </body>
//       </html>
//     `
    
//     const printWindow = window.open('', '_blank')
//     printWindow.document.write(printContent)
//     printWindow.document.close()
//     printWindow.print()
//   }

//   const handlePrintAllStudents = () => {
//     const allStudents = getFilteredStudents()
//     const groupedBySection = getStudentsGroupedBySectionAndClass()
    
//     const printContent = `
//       <html>
//         <head>
//           <title>Liste complète des élèves</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             .header { text-align: center; margin-bottom: 30px; }
//             .header h1 { color: #333; margin-bottom: 5px; }
//             .header .subtitle { color: #666; }
//             .section-title { margin: 30px 0 15px 0; color: #2c3e50; border-bottom: 2px solid #4a90e2; padding-bottom: 5px; }
//             .class-title { margin: 20px 0 10px 0; color: #34495e; font-size: 16px; }
//             .class-info { margin-bottom: 15px; padding: 8px; background: #f5f5f5; border-radius: 5px; }
//             table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
//             th { background: #4a90e2; color: white; padding: 10px; text-align: left; }
//             td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
//             .status-paid { color: green; font-weight: bold; }
//             .status-pending { color: #e67e22; }
//             .print-date { text-align: right; color: #666; margin-bottom: 20px; }
//             .summary { margin: 20px 0; padding: 15px; background: #ecf0f1; border-radius: 5px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>GROUPE SCOLAIRE BILINGUE LA GRÂCE DE DIEU</h1>
//             <div class="subtitle">Liste complète des élèves - Année ${new Date().getFullYear()}/${new Date().getFullYear() + 1}</div>
//             <div class="print-date">Imprimé le ${new Date().toLocaleDateString()}</div>
//           </div>
          
//           <div class="summary">
//             <strong>RÉSUMÉ GÉNÉRAL</strong><br>
//             Total élèves: ${allStudents.length}<br>
//             Section francophone: ${groupedBySection.im1 ? Object.values(groupedBySection.im1).flat().length : 0}<br>
//             Section anglophone: ${groupedBySection.im2 ? Object.values(groupedBySection.im2).flat().length : 0}<br>
//             Élèves soldés: ${allStudents.filter(s => isStudentFullyPaid(s)).length}<br>
//             Élèves en cours: ${allStudents.filter(s => !isStudentFullyPaid(s)).length}
//           </div>
          
//           ${Object.keys(groupedBySection).map(sectionKey => {
//             if (Object.keys(groupedBySection[sectionKey]).length === 0) return ''
            
//             const sectionName = sectionKey === 'im1' ? 'FRANCOPHONE' : 'ANGLAIS'
            
//             return `
//               <h2 class="section-title">SECTION ${sectionName}</h2>
              
//               ${Object.keys(groupedBySection[sectionKey]).map(className => {
//                 const classStudents = groupedBySection[sectionKey][className]
                
//                 return `
//                   <h3 class="class-title">Classe ${className}</h3>
//                   <div class="class-info">
//                     Nombre d'élèves: ${classStudents.length} | 
//                     Soldés: ${classStudents.filter(s => isStudentFullyPaid(s)).length} | 
//                     En cours: ${classStudents.filter(s => !isStudentFullyPaid(s)).length}
//                   </div>
                  
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>N°</th>
//                         <th>Nom de l'élève</th>
//                         <th>Matricule</th>
//                         <th>Année scolaire</th>
//                         <th>Statut paiement</th>
//                         <th>Total payé</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       ${classStudents.map((student, index) => {
//                         const paymentStatus = getPaymentStatus(student)
//                         return `
//                           <tr>
//                             <td>${index + 1}</td>
//                             <td>${student.name}</td>
//                             <td>${student.matricule || 'N/A'}</td>
//                             <td>${getStudentSchoolYear(student)}</td>
//                             <td class="${paymentStatus.isFullyPaid ? 'status-paid' : 'status-pending'}">
//                               ${paymentStatus.isFullyPaid ? 'SOLDÉ' : `Reste: ${formatCurrency(paymentStatus.remaining)}`}
//                             </td>
//                             <td>${formatCurrency(paymentStatus.totalPaid)}</td>
//                           </tr>
//                         `
//                       }).join('')}
//                     </tbody>
//                   </table>
//                 `
//               }).join('')}
//             `
//           }).join('')}
          
//           <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
//             <p>Document généré automatiquement par le système de gestion de scolarité</p>
//           </div>
//         </body>
//       </html>
//     `
    
//     const printWindow = window.open('', '_blank')
//     printWindow.document.write(printContent)
//     printWindow.document.close()
//     printWindow.print()
//   }

//   const groupedStudents = getStudentsGroupedBySectionAndClass()

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
//                 {getFilteredStudents().length} élève{getFilteredStudents().length !== 1 ? 's' : ''} trouvé{getFilteredStudents().length !== 1 ? 's' : ''}
//                 {activeSection !== 'all' && (
//                   <span className="section-filter-indicator">
//                     • {activeSection === 'im1' ? 'Francophone' : 'Anglophone'}
//                   </span>
//                 )}
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

//         {/* Sélecteur de section */}
//         <div className="section-selector">
//           <div className="section-tabs">
//             <button
//               className={`section-tab ${activeSection === 'all' ? 'active' : ''}`}
//               onClick={() => setActiveSection('all')}
//             >
//               <Globe className="tab-icon" />
//               Tous les élèves
//               <span className="tab-count">{students.length}</span>
//             </button>
            
//             <button
//               className={`section-tab ${activeSection === 'im1' ? 'active' : ''}`}
//               onClick={() => setActiveSection('im1')}
//             >
//               <BookOpen className="tab-icon" />
//               Section francophone
//               <span className="tab-count">{students.filter(s => s.section === 'im1').length}</span>
//               <span className="tab-paid">{students.filter(s => s.section === 'im1' && isStudentFullyPaid(s)).length} soldés</span>
//             </button>
            
//             <button
//               className={`section-tab ${activeSection === 'im2' ? 'active' : ''}`}
//               onClick={() => setActiveSection('im2')}
//             >
//               <Globe className="tab-icon" />
//               Section anglophone
//               <span className="tab-count">{students.filter(s => s.section === 'im2').length}</span>
//               <span className="tab-paid">{students.filter(s => s.section === 'im2' && isStudentFullyPaid(s)).length} soldés</span>
//             </button>
//           </div>
          
//           {/* Bouton d'impression pour tout */}
//           {getFilteredStudents().length > 0 && (
//             <div className="print-actions">
//               <button
//                 onClick={handlePrintAllStudents}
//                 className="print-button"
//               >
//                 <Printer className="print-icon" />
//                 Imprimer la liste complète
//               </button>
//             </div>
//           )}
//         </div>

//         {getFilteredStudents().length === 0 ? (
//           <div className="empty-state">
//             <User className="empty-icon" />
//             <h3 className="empty-title">Aucun élève trouvé</h3>
//             <p className="empty-description">
//               {searchTerm 
//                 ? `Aucun élève ne correspond à votre recherche${activeSection !== 'all' ? ` dans la section ${activeSection === 'im1' ? 'francophone' : 'anglophone'}.` : '.'}`
//                 : activeSection !== 'all' 
//                   ? `Aucun élève n'a été enregistré dans la section ${activeSection === 'im1' ? 'francophone' : 'anglophone'}.`
//                   : 'Aucun élève n\'a été enregistré pour le moment.'}
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
//           <div className="students-sections-container">
//             {activeSection === 'all' ? (
//               // Afficher les deux sections avec classification par classe
//               <>
//                 {/* Section francophone */}
//                 {Object.keys(groupedStudents.im1).length > 0 && (
//                   <div className="section-group">
//                     <div className="section-header">
//                       <BookOpen className="section-icon" />
//                       <h2 className="section-title">Section francophone</h2>
//                       <div className="section-actions">
//                         <span className="section-stats">
//                           {Object.values(groupedStudents.im1).flat().length} élève{Object.values(groupedStudents.im1).flat().length !== 1 ? 's' : ''}
//                           <span className="section-paid">
//                             • {Object.values(groupedStudents.im1).flat().filter(s => isStudentFullyPaid(s)).length} soldés
//                           </span>
//                         </span>
//                         <button
//                           onClick={() => {
//                             const sectionStudents = Object.values(groupedStudents.im1).flat()
//                             handlePrintClassList("Francophone - Toutes classes", sectionStudents)
//                           }}
//                           className="print-section-button"
//                         >
//                           <Printer className="print-icon" />
//                           Imprimer section
//                         </button>
//                       </div>
//                     </div>
                    
//                     {Object.keys(groupedStudents.im1).map(className => (
//                       <div key={className} className="class-group">
//                         <div className="class-header">
//                           <h3 className="class-title">Classe {className}</h3>
//                           <div className="class-actions">
//                             <span className="class-stats">
//                               {groupedStudents.im1[className].length} élève{groupedStudents.im1[className].length !== 1 ? 's' : ''}
//                               <span className="class-paid">
//                                 • {groupedStudents.im1[className].filter(s => isStudentFullyPaid(s)).length} soldés
//                               </span>
//                             </span>
//                             <button
//                               onClick={() => handlePrintClassList(className, groupedStudents.im1[className])}
//                               className="print-class-button"
//                             >
//                               <Printer className="print-icon" />
//                               Imprimer
//                             </button>
//                           </div>
//                         </div>
                        
//                         <div className="students-table-container">
//                           <div className="table-wrapper">
//                             <table className="students-table">
//                               <thead className="table-header">
//                                 <tr>
//                                   <th className="table-head">Élève</th>
//                                   <th className="table-head">Matricule</th>
//                                   <th className="table-head">Année scolaire</th>
//                                   <th className="table-head">Statut</th>
//                                   <th className="table-head actions-head">Actions</th>
//                                 </tr>
//                               </thead>
//                               <tbody className="table-body">
//                                 {groupedStudents.im1[className].map((student) => {
//                                   const paymentStatus = getPaymentStatus(student)
//                                   const isFullyPaid = paymentStatus.isFullyPaid
                                  
//                                   return (
//                                     <tr key={student.id} className="table-row">
//                                       <td className="student-cell">
//                                         <div className="student-info">
//                                           <div className="student-avatar">
//                                             <User className="avatar-icon" />
//                                           </div>
//                                           <div className="student-details">
//                                             <div className="student-name">
//                                               {student.name}
//                                             </div>
//                                             {isFullyPaid && (
//                                               <div className="payment-detail">
//                                                 Total payé: {formatCurrency(paymentStatus.totalPaid)}
//                                               </div>
//                                             )}
//                                           </div>
//                                         </div>
//                                       </td>
//                                       <td className="matricule-cell">
//                                         {student.matricule || 'N/A'}
//                                       </td>
//                                       <td className="year-cell">
//                                         <div className="year-info">
//                                           <Calendar className="year-icon" />
//                                           {getStudentSchoolYear(student)}
//                                         </div>
//                                       </td>
//                                       <td className="status-cell">
//                                         {isFullyPaid ? (
//                                           <div className="status-badge fully-paid">
//                                             <CheckCircle className="status-icon" />
//                                             SOLDÉ
//                                           </div>
//                                         ) : (
//                                           <div className="status-badge pending">
//                                             Reste: {formatCurrency(paymentStatus.remaining)}
//                                           </div>
//                                         )}
//                                       </td>
//                                       <td className="actions-cell">
//                                         <div className="action-buttons">
//                                           <button
//                                             onClick={() => onViewStudent(student)}
//                                             className="view-button"
//                                           >
//                                             <Eye className="view-icon" />
//                                             Voir détail
//                                           </button>
//                                           {!isFullyPaid ? (
//                                             <button
//                                               onClick={() => handleContinuePayment(student)}
//                                               className="continue-payment-button"
//                                             >
//                                               <DollarSign className="button-icon" />
//                                               Poursuivre paiement
//                                             </button>
//                                           ) : (
//                                             <div className="fully-paid-indicator">
//                                               <CheckCircle className="button-icon" />
//                                               Scolarité soldée
//                                             </div>
//                                           )}
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   )
//                                 })}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Section anglophone */}
//                 {Object.keys(groupedStudents.im2).length > 0 && (
//                   <div className="section-group">
//                     <div className="section-header">
//                       <Globe className="section-icon" />
//                       <h2 className="section-title">Section anglophone</h2>
//                       <div className="section-actions">
//                         <span className="section-stats">
//                           {Object.values(groupedStudents.im2).flat().length} élève{Object.values(groupedStudents.im2).flat().length !== 1 ? 's' : ''}
//                           <span className="section-paid">
//                             • {Object.values(groupedStudents.im2).flat().filter(s => isStudentFullyPaid(s)).length} soldés
//                           </span>
//                         </span>
//                         <button
//                           onClick={() => {
//                             const sectionStudents = Object.values(groupedStudents.im2).flat()
//                             handlePrintClassList("Anglophone - Toutes classes", sectionStudents)
//                           }}
//                           className="print-section-button"
//                         >
//                           <Printer className="print-icon" />
//                           Imprimer section
//                         </button>
//                       </div>
//                     </div>
                    
//                     {Object.keys(groupedStudents.im2).map(className => (
//                       <div key={className} className="class-group">
//                         <div className="class-header">
//                           <h3 className="class-title">Classe {className}</h3>
//                           <div className="class-actions">
//                             <span className="class-stats">
//                               {groupedStudents.im2[className].length} élève{groupedStudents.im2[className].length !== 1 ? 's' : ''}
//                               <span className="class-paid">
//                                 • {groupedStudents.im2[className].filter(s => isStudentFullyPaid(s)).length} soldés
//                               </span>
//                             </span>
//                             <button
//                               onClick={() => handlePrintClassList(className, groupedStudents.im2[className])}
//                               className="print-class-button"
//                             >
//                               <Printer className="print-icon" />
//                               Imprimer
//                             </button>
//                           </div>
//                         </div>
                        
//                         <div className="students-table-container">
//                           <div className="table-wrapper">
//                             <table className="students-table">
//                               <thead className="table-header">
//                                 <tr>
//                                   <th className="table-head">Élève</th>
//                                   <th className="table-head">Matricule</th>
//                                   <th className="table-head">Année scolaire</th>
//                                   <th className="table-head">Statut</th>
//                                   <th className="table-head actions-head">Actions</th>
//                                 </tr>
//                               </thead>
//                               <tbody className="table-body">
//                                 {groupedStudents.im2[className].map((student) => {
//                                   const paymentStatus = getPaymentStatus(student)
//                                   const isFullyPaid = paymentStatus.isFullyPaid
                                  
//                                   return (
//                                     <tr key={student.id} className="table-row">
//                                       <td className="student-cell">
//                                         <div className="student-info">
//                                           <div className="student-avatar">
//                                             <User className="avatar-icon" />
//                                           </div>
//                                           <div className="student-details">
//                                             <div className="student-name">
//                                               {student.name}
//                                             </div>
//                                             {isFullyPaid && (
//                                               <div className="payment-detail">
//                                                 Total payé: {formatCurrency(paymentStatus.totalPaid)}
//                                               </div>
//                                             )}
//                                           </div>
//                                         </div>
//                                       </td>
//                                       <td className="matricule-cell">
//                                         {student.matricule || 'N/A'}
//                                       </td>
//                                       <td className="year-cell">
//                                         <div className="year-info">
//                                           <Calendar className="year-icon" />
//                                           {getStudentSchoolYear(student)}
//                                         </div>
//                                       </td>
//                                       <td className="status-cell">
//                                         {isFullyPaid ? (
//                                           <div className="status-badge fully-paid">
//                                             <CheckCircle className="status-icon" />
//                                             SOLDÉ
//                                           </div>
//                                         ) : (
//                                           <div className="status-badge pending">
//                                             Reste: {formatCurrency(paymentStatus.remaining)}
//                                           </div>
//                                         )}
//                                       </td>
//                                       <td className="actions-cell">
//                                         <div className="action-buttons">
//                                           <button
//                                             onClick={() => onViewStudent(student)}
//                                             className="view-button"
//                                           >
//                                             <Eye className="view-icon" />
//                                             Voir détail
//                                           </button>
//                                           {!isFullyPaid ? (
//                                             <button
//                                               onClick={() => handleContinuePayment(student)}
//                                               className="continue-payment-button"
//                                             >
//                                               <DollarSign className="button-icon" />
//                                               Poursuivre paiement
//                                             </button>
//                                           ) : (
//                                             <div className="fully-paid-indicator">
//                                               <CheckCircle className="button-icon" />
//                                               Scolarité soldée
//                                             </div>
//                                           )}
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   )
//                                 })}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </>
//             ) : (
//               // Afficher une seule section avec classification par classe
//               <div className="single-section-view">
//                 <div className="section-header">
//                   {activeSection === 'im1' ? (
//                     <>
//                       <BookOpen className="section-icon" />
//                       <h2 className="section-title">Section francophone</h2>
//                     </>
//                   ) : (
//                     <>
//                       <Globe className="section-icon" />
//                       <h2 className="section-title">Section anglophone</h2>
//                     </>
//                   )}
//                   <div className="section-actions">
//                     <span className="section-stats">
//                       {getFilteredStudents().length} élève{getFilteredStudents().length !== 1 ? 's' : ''}
//                       <span className="section-paid">
//                         • {getFilteredStudents().filter(s => isStudentFullyPaid(s)).length} soldés
//                       </span>
//                     </span>
//                     <button
//                       onClick={() => handlePrintClassList(`${activeSection === 'im1' ? 'Francophone' : 'Anglophone'} - Toutes classes`, getFilteredStudents())}
//                       className="print-section-button"
//                     >
//                       <Printer className="print-icon" />
//                       Imprimer section
//                     </button>
//                   </div>
//                 </div>
                
//                 {Object.keys(groupedStudents[activeSection]).map(className => (
//                   <div key={className} className="class-group">
//                     <div className="class-header">
//                       <h3 className="class-title">Classe {className}</h3>
//                       <div className="class-actions">
//                         <span className="class-stats">
//                           {groupedStudents[activeSection][className].length} élève{groupedStudents[activeSection][className].length !== 1 ? 's' : ''}
//                           <span className="class-paid">
//                             • {groupedStudents[activeSection][className].filter(s => isStudentFullyPaid(s)).length} soldés
//                           </span>
//                         </span>
//                         <button
//                           onClick={() => handlePrintClassList(className, groupedStudents[activeSection][className])}
//                           className="print-class-button"
//                         >
//                           <Printer className="print-icon" />
//                           Imprimer
//                         </button>
//                       </div>
//                     </div>
                    
//                     <div className="students-table-container">
//                       <div className="table-wrapper">
//                         <table className="students-table">
//                           <thead className="table-header">
//                             <tr>
//                               <th className="table-head">Élève</th>
//                               <th className="table-head">Matricule</th>
//                               <th className="table-head">Année scolaire</th>
//                               <th className="table-head">Statut</th>
//                               <th className="table-head actions-head">Actions</th>
//                             </tr>
//                           </thead>
//                           <tbody className="table-body">
//                             {groupedStudents[activeSection][className].map((student) => {
//                               const paymentStatus = getPaymentStatus(student)
//                               const isFullyPaid = paymentStatus.isFullyPaid
                              
//                               return (
//                                 <tr key={student.id} className="table-row">
//                                   <td className="student-cell">
//                                     <div className="student-info">
//                                       <div className="student-avatar">
//                                         <User className="avatar-icon" />
//                                       </div>
//                                       <div className="student-details">
//                                         <div className="student-name">
//                                           {student.name}
//                                         </div>
//                                         {isFullyPaid && (
//                                           <div className="payment-detail">
//                                             Total payé: {formatCurrency(paymentStatus.totalPaid)}
//                                           </div>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </td>
//                                   <td className="matricule-cell">
//                                     {student.matricule || 'N/A'}
//                                   </td>
//                                   <td className="year-cell">
//                                     <div className="year-info">
//                                       <Calendar className="year-icon" />
//                                       {getStudentSchoolYear(student)}
//                                     </div>
//                                   </td>
//                                   <td className="status-cell">
//                                     {isFullyPaid ? (
//                                       <div className="status-badge fully-paid">
//                                         <CheckCircle className="status-icon" />
//                                         SOLDÉ
//                                       </div>
//                                     ) : (
//                                       <div className="status-badge pending">
//                                         Reste: {formatCurrency(paymentStatus.remaining)}
//                                       </div>
//                                     )}
//                                   </td>
//                                   <td className="actions-cell">
//                                     <div className="action-buttons">
//                                       <button
//                                         onClick={() => onViewStudent(student)}
//                                         className="view-button"
//                                       >
//                                         <Eye className="view-icon" />
//                                         Voir détail
//                                       </button>
//                                       {!isFullyPaid ? (
//                                         <button
//                                           onClick={() => handleContinuePayment(student)}
//                                           className="continue-payment-button"
//                                         >
//                                           <DollarSign className="button-icon" />
//                                           Poursuivre paiement
//                                         </button>
//                                       ) : (
//                                         <div className="fully-paid-indicator">
//                                           <CheckCircle className="button-icon" />
//                                           Scolarité soldée
//                                         </div>
//                                       )}
//                                     </div>
//                                   </td>
//                                 </tr>
//                               )
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
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
import { Search, Eye, User, Calendar, DollarSign, CheckCircle, Globe, BookOpen, Printer } from 'lucide-react'
import { api } from '../lib/api'
import { formatCurrency } from '../lib/format'
import { getFees } from '../lib/fees'
import '../Styles/Students.css'

export function Students({ onViewStudent, navigateTo, onContinuePayment }) {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [studentPayments, setStudentPayments] = useState({})
  const [activeSection, setActiveSection] = useState('all') // 'all', 'im1', 'im2'

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

  const isStudentFullyPaid = (student) => {
    const payments = studentPayments[student.id] || []
    
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
        alreadyPaidAmounts.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0
        alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
        alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
        alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
      }
    })
    
    const fees = getFees(student.section, student.class)
    if (!fees) return false
    
    const totalDue = fees.inscription + (fees.fraisAnnexes || 0) + fees.pension.reduce((sum, item) => sum + item.amount, 0)
    const totalPaid = Object.values(alreadyPaidAmounts).reduce((sum, amount) => sum + amount, 0)
    
    return totalPaid >= totalDue
  }

  const getPaymentStatus = (student) => {
    const payments = studentPayments[student.id] || []
    
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
        alreadyPaidAmounts.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0
        alreadyPaidAmounts.pension_0 += payment.paidAmounts.pension_0 || 0
        alreadyPaidAmounts.pension_1 += payment.paidAmounts.pension_1 || 0
        alreadyPaidAmounts.pension_2 += payment.paidAmounts.pension_2 || 0
      }
    })
    
    const fees = getFees(student.section, student.class)
    if (!fees) return { isFullyPaid: false, totalDue: 0, totalPaid: 0, remaining: 0 }
    
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

  // Grouper les élèves par classe
  const groupStudentsByClass = (studentsList) => {
    const grouped = {}
    
    studentsList.forEach(student => {
      if (!grouped[student.class]) {
        grouped[student.class] = []
      }
      grouped[student.class].push(student)
    })
    
    // Trier les classes par ordre alphabétique
    return Object.keys(grouped)
      .sort()
      .reduce((sorted, className) => {
        sorted[className] = grouped[className]
        return sorted
      }, {})
  }

  // Filtrer les élèves par section et recherche
  const getFilteredStudents = () => {
    return students.filter(student => {
      const sectionMatch = activeSection === 'all' || student.section === activeSection
      
      const searchMatch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.matricule?.toLowerCase().includes(searchTerm.toLowerCase())
      
      return sectionMatch && searchMatch
    })
  }

  // Grouper les élèves par section et classe
  const getStudentsGroupedBySectionAndClass = () => {
    const filtered = getFilteredStudents()
    const grouped = {
      im1: groupStudentsByClass(filtered.filter(s => s.section === 'im1')),
      im2: groupStudentsByClass(filtered.filter(s => s.section === 'im2'))
    }
    
    return grouped
  }

  const handleContinuePayment = (student) => {
    if (onContinuePayment) {
      onContinuePayment(student)
    }
  }

  const handlePrintClassList = (className, sectionStudents, sectionName = '') => {
    const printContent = `
      <html>
        <head>
          <title>Liste des élèves - ${className}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #333; margin-bottom: 5px; }
            .header .subtitle { color: #666; }
            .class-info { margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #4a90e2; color: white; padding: 10px; text-align: left; }
            td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
            .status-paid { color: green; font-weight: bold; }
            .status-pending { color: #e67e22; }
            .print-date { text-align: right; color: #666; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GROUPE SCOLAIRE BILINGUE LA GRÂCE DE DIEU</h1>
            <div class="subtitle">Liste des élèves - ${className} ${sectionName ? `(${sectionName})` : ''}</div>
            <div class="print-date">Imprimé le ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="class-info">
            <strong>Classe:</strong> ${className}<br>
            <strong>Nombre d'élèves:</strong> ${sectionStudents.length}
          </div>
          
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Nom de l'élève</th>
                <th>Matricule</th>
                <th>Année scolaire</th>
                <th>Statut paiement</th>
                <th>Total payé</th>
              </tr>
            </thead>
            <tbody>
              ${sectionStudents.map((student, index) => {
                const paymentStatus = getPaymentStatus(student)
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${student.name}</td>
                    <td>${student.matricule || 'N/A'}</td>
                    <td>${getStudentSchoolYear(student)}</td>
                    <td class="${paymentStatus.isFullyPaid ? 'status-paid' : 'status-pending'}">
                      ${paymentStatus.isFullyPaid ? 'SOLDÉ' : `Reste: ${formatCurrency(paymentStatus.remaining)}`}
                    </td>
                    <td>${formatCurrency(paymentStatus.totalPaid)}</td>
                  </tr>
                `
              }).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; text-align: center; color: #666;">
            <p>Total élèves: ${sectionStudents.length} | 
               Soldés: ${sectionStudents.filter(s => isStudentFullyPaid(s)).length} | 
               En cours: ${sectionStudents.filter(s => !isStudentFullyPaid(s)).length}</p>
          </div>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const handlePrintAllStudents = () => {
    const allStudents = getFilteredStudents()
    const groupedBySection = getStudentsGroupedBySectionAndClass()
    
    const printContent = `
      <html>
        <head>
          <title>Liste complète des élèves</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #333; margin-bottom: 5px; }
            .header .subtitle { color: #666; }
            .section-title { margin: 30px 0 15px 0; color: #2c3e50; border-bottom: 2px solid #4a90e2; padding-bottom: 5px; }
            .class-title { margin: 20px 0 10px 0; color: #34495e; font-size: 16px; }
            .class-info { margin-bottom: 15px; padding: 8px; background: #f5f5f5; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #4a90e2; color: white; padding: 10px; text-align: left; }
            td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
            .status-paid { color: green; font-weight: bold; }
            .status-pending { color: #e67e22; }
            .print-date { text-align: right; color: #666; margin-bottom: 20px; }
            .summary { margin: 20px 0; padding: 15px; background: #ecf0f1; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GROUPE SCOLAIRE BILINGUE LA GRÂCE DE DIEU</h1>
            <div class="subtitle">Liste complète des élèves</div>
            <div class="print-date">Imprimé le ${new Date().toLocaleDateString()}</div>
          </div>
          
          <div class="summary">
            <strong>RÉSUMÉ GÉNÉRAL</strong><br>
            Total élèves: ${allStudents.length}<br>
            Section francophone: ${groupedBySection.im1 ? Object.values(groupedBySection.im1).flat().length : 0}<br>
            Section anglophone: ${groupedBySection.im2 ? Object.values(groupedBySection.im2).flat().length : 0}<br>
            Élèves soldés: ${allStudents.filter(s => isStudentFullyPaid(s)).length}<br>
            Élèves en cours: ${allStudents.filter(s => !isStudentFullyPaid(s)).length}
          </div>
          
          ${Object.keys(groupedBySection).map(sectionKey => {
            if (Object.keys(groupedBySection[sectionKey]).length === 0) return ''
            
            const sectionName = sectionKey === 'im1' ? 'FRANCOPHONE' : 'ANGLAIS'
            
            return `
              <h2 class="section-title">SECTION ${sectionName}</h2>
              
              ${Object.keys(groupedBySection[sectionKey]).map(className => {
                const classStudents = groupedBySection[sectionKey][className]
                
                return `
                  <h3 class="class-title">Classe ${className}</h3>
                  <div class="class-info">
                    Nombre d'élèves: ${classStudents.length} | 
                    Soldés: ${classStudents.filter(s => isStudentFullyPaid(s)).length} | 
                    En cours: ${classStudents.filter(s => !isStudentFullyPaid(s)).length}
                  </div>
                  
                  <table>
                    <thead>
                      <tr>
                        <th>N°</th>
                        <th>Nom de l'élève</th>
                        <th>Matricule</th>
                        <th>Année scolaire</th>
                        <th>Statut paiement</th>
                        <th>Total payé</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${classStudents.map((student, index) => {
                        const paymentStatus = getPaymentStatus(student)
                        return `
                          <tr>
                            <td>${index + 1}</td>
                            <td>${student.name}</td>
                            <td>${student.matricule || 'N/A'}</td>
                            <td>${getStudentSchoolYear(student)}</td>
                            <td class="${paymentStatus.isFullyPaid ? 'status-paid' : 'status-pending'}">
                              ${paymentStatus.isFullyPaid ? 'SOLDÉ' : `Reste: ${formatCurrency(paymentStatus.remaining)}`}
                            </td>
                            <td>${formatCurrency(paymentStatus.totalPaid)}</td>
                          </tr>
                        `
                      }).join('')}
                    </tbody>
                  </table>
                `
              }).join('')}
            `
          }).join('')}
          
          <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
            <p>Document généré automatiquement par le système de gestion de scolarité</p>
          </div>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  const groupedStudents = getStudentsGroupedBySectionAndClass()

  // Statistiques par section
  const sectionStats = {
    im1: {
      count: Object.values(groupedStudents.im1).flat().length,
      fullyPaid: Object.values(groupedStudents.im1).flat().filter(s => isStudentFullyPaid(s)).length,
      total: students.filter(s => s.section === 'im1').length
    },
    im2: {
      count: Object.values(groupedStudents.im2).flat().length,
      fullyPaid: Object.values(groupedStudents.im2).flat().filter(s => isStudentFullyPaid(s)).length,
      total: students.filter(s => s.section === 'im2').length
    },
    all: {
      count: getFilteredStudents().length,
      fullyPaid: getFilteredStudents().filter(s => isStudentFullyPaid(s)).length,
      total: students.length
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
                {sectionStats.all.count} élève{sectionStats.all.count !== 1 ? 's' : ''} trouvé{sectionStats.all.count !== 1 ? 's' : ''}
                {activeSection !== 'all' && (
                  <span className="section-filter-indicator">
                    • {activeSection === 'im1' ? 'Francophone' : 'Anglophone'}
                  </span>
                )}
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

        {/* Sélecteur de section */}
        <div className="section-selector">
          <div className="section-tabs">
            <button
              className={`section-tab ${activeSection === 'all' ? 'active' : ''}`}
              onClick={() => setActiveSection('all')}
            >
              <Globe className="tab-icon" />
              Tous les élèves
              <span className="tab-count">{sectionStats.all.total}</span>
            </button>
            
            <button
              className={`section-tab ${activeSection === 'im1' ? 'active' : ''}`}
              onClick={() => setActiveSection('im1')}
            >
              <BookOpen className="tab-icon" />
              Section francophone
              <span className="tab-count">{sectionStats.im1.total}</span>
              <span className="tab-paid">{sectionStats.im1.fullyPaid} soldés</span>
            </button>
            
            <button
              className={`section-tab ${activeSection === 'im2' ? 'active' : ''}`}
              onClick={() => setActiveSection('im2')}
            >
              <Globe className="tab-icon" />
              Section anglophone
              <span className="tab-count">{sectionStats.im2.total}</span>
              <span className="tab-paid">{sectionStats.im2.fullyPaid} soldés</span>
            </button>
          </div>
          
          {/* Bouton d'impression pour tout */}
          {getFilteredStudents().length > 0 && (
            <div className="print-actions">
              <button
                onClick={handlePrintAllStudents}
                className="print-button"
              >
                <Printer className="print-icon" />
                Imprimer la liste complète
              </button>
            </div>
          )}
        </div>

        {getFilteredStudents().length === 0 ? (
          <div className="empty-state">
            <User className="empty-icon" />
            <h3 className="empty-title">Aucun élève trouvé</h3>
            <p className="empty-description">
              {searchTerm 
                ? `Aucun élève ne correspond à votre recherche${activeSection !== 'all' ? ` dans la section ${activeSection === 'im1' ? 'francophone' : 'anglophone'}.` : '.'}`
                : activeSection !== 'all' 
                  ? `Aucun élève n'a été enregistré dans la section ${activeSection === 'im1' ? 'francophone' : 'anglophone'}.`
                  : 'Aucun élève n\'a été enregistré pour le moment.'}
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
          <div className="students-sections-container">
            {activeSection === 'all' ? (
              // Afficher les deux sections avec classification par classe
              <>
                {/* Section francophone */}
                {Object.keys(groupedStudents.im1).length > 0 && (
                  <div className="section-group">
                    <div className="section-header">
                      <BookOpen className="section-icon" />
                      <h2 className="section-title">Section francophone</h2>
                      <div className="section-actions">
                        <span className="section-stats">
                          {Object.values(groupedStudents.im1).flat().length} élève{Object.values(groupedStudents.im1).flat().length !== 1 ? 's' : ''}
                          <span className="section-paid">
                            • {Object.values(groupedStudents.im1).flat().filter(s => isStudentFullyPaid(s)).length} soldés
                          </span>
                        </span>
                        <button
                          onClick={() => handlePrintClassList("Section Francophone - Toutes classes", Object.values(groupedStudents.im1).flat(), "Section Francophone")}
                          className="print-section-button"
                        >
                          <Printer className="print-icon" />
                          Imprimer section
                        </button>
                      </div>
                    </div>
                    
                    {Object.keys(groupedStudents.im1).map(className => (
                      <div key={className} className="class-group">
                        <div className="class-header">
                          <h3 className="class-title">Classe {className}</h3>
                          <div className="class-actions">
                            <span className="class-stats">
                              {groupedStudents.im1[className].length} élève{groupedStudents.im1[className].length !== 1 ? 's' : ''}
                              <span className="class-paid">
                                • {groupedStudents.im1[className].filter(s => isStudentFullyPaid(s)).length} soldés
                              </span>
                            </span>
                            <button
                              onClick={() => handlePrintClassList(className, groupedStudents.im1[className], "Section Francophone")}
                              className="print-class-button"
                            >
                              <Printer className="print-icon" />
                              Imprimer
                            </button>
                          </div>
                        </div>
                        
                        <div className="students-table-container">
                          <div className="table-wrapper">
                            <table className="students-table">
                              <thead className="table-header">
                                <tr>
                                  <th className="table-head">Élève</th>
                                  <th className="table-head">Matricule</th>
                                  <th className="table-head">Année scolaire</th>
                                  <th className="table-head">Statut</th>
                                  <th className="table-head actions-head">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="table-body">
                                {groupedStudents.im1[className].map((student) => {
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
                                      <td className="matricule-cell">
                                        {student.matricule || 'N/A'}
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
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Section anglophone */}
                {Object.keys(groupedStudents.im2).length > 0 && (
                  <div className="section-group">
                    <div className="section-header">
                      <Globe className="section-icon" />
                      <h2 className="section-title">Section anglophone</h2>
                      <div className="section-actions">
                        <span className="section-stats">
                          {Object.values(groupedStudents.im2).flat().length} élève{Object.values(groupedStudents.im2).flat().length !== 1 ? 's' : ''}
                          <span className="section-paid">
                            • {Object.values(groupedStudents.im2).flat().filter(s => isStudentFullyPaid(s)).length} soldés
                          </span>
                        </span>
                        <button
                          onClick={() => handlePrintClassList("Section Anglophone - Toutes classes", Object.values(groupedStudents.im2).flat(), "Section Anglophone")}
                          className="print-section-button"
                        >
                          <Printer className="print-icon" />
                          Imprimer section
                        </button>
                      </div>
                    </div>
                    
                    {Object.keys(groupedStudents.im2).map(className => (
                      <div key={className} className="class-group">
                        <div className="class-header">
                          <h3 className="class-title">Classe {className}</h3>
                          <div className="class-actions">
                            <span className="class-stats">
                              {groupedStudents.im2[className].length} élève{groupedStudents.im2[className].length !== 1 ? 's' : ''}
                              <span className="class-paid">
                                • {groupedStudents.im2[className].filter(s => isStudentFullyPaid(s)).length} soldés
                              </span>
                            </span>
                            <button
                              onClick={() => handlePrintClassList(className, groupedStudents.im2[className], "Section Anglophone")}
                              className="print-class-button"
                            >
                              <Printer className="print-icon" />
                              Imprimer
                            </button>
                          </div>
                        </div>
                        
                        <div className="students-table-container">
                          <div className="table-wrapper">
                            <table className="students-table">
                              <thead className="table-header">
                                <tr>
                                  <th className="table-head">Élève</th>
                                  <th className="table-head">Matricule</th>
                                  <th className="table-head">Année scolaire</th>
                                  <th className="table-head">Statut</th>
                                  <th className="table-head actions-head">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="table-body">
                                {groupedStudents.im2[className].map((student) => {
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
                                      <td className="matricule-cell">
                                        {student.matricule || 'N/A'}
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
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              // Afficher une seule section avec classification par classe
              <div className="single-section-view">
                <div className="section-header">
                  {activeSection === 'im1' ? (
                    <>
                      <BookOpen className="section-icon" />
                      <h2 className="section-title">Section francophone</h2>
                    </>
                  ) : (
                    <>
                      <Globe className="section-icon" />
                      <h2 className="section-title">Section anglophone</h2>
                    </>
                  )}
                  <div className="section-actions">
                    <span className="section-stats">
                      {getFilteredStudents().length} élève{getFilteredStudents().length !== 1 ? 's' : ''}
                      <span className="section-paid">
                        • {getFilteredStudents().filter(s => isStudentFullyPaid(s)).length} soldés
                      </span>
                    </span>
                    <button
                      onClick={() => handlePrintClassList(`${activeSection === 'im1' ? 'Section Francophone' : 'Section Anglophone'} - Toutes classes`, getFilteredStudents(), activeSection === 'im1' ? 'Section Francophone' : 'Section Anglophone')}
                      className="print-section-button"
                    >
                      <Printer className="print-icon" />
                      Imprimer section
                    </button>
                  </div>
                </div>
                
                {Object.keys(groupedStudents[activeSection]).map(className => (
                  <div key={className} className="class-group">
                    <div className="class-header">
                      <h3 className="class-title">Classe {className}</h3>
                      <div className="class-actions">
                        <span className="class-stats">
                          {groupedStudents[activeSection][className].length} élève{groupedStudents[activeSection][className].length !== 1 ? 's' : ''}
                          <span className="class-paid">
                            • {groupedStudents[activeSection][className].filter(s => isStudentFullyPaid(s)).length} soldés
                          </span>
                        </span>
                        <button
                          onClick={() => handlePrintClassList(className, groupedStudents[activeSection][className], activeSection === 'im1' ? 'Section Francophone' : 'Section Anglophone')}
                          className="print-class-button"
                        >
                          <Printer className="print-icon" />
                          Imprimer
                        </button>
                      </div>
                    </div>
                    
                    <div className="students-table-container">
                      <div className="table-wrapper">
                        <table className="students-table">
                          <thead className="table-header">
                            <tr>
                              <th className="table-head">Élève</th>
                              <th className="table-head">Matricule</th>
                              <th className="table-head">Année scolaire</th>
                              <th className="table-head">Statut</th>
                              <th className="table-head actions-head">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="table-body">
                            {groupedStudents[activeSection][className].map((student) => {
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
                                  <td className="matricule-cell">
                                    {student.matricule || 'N/A'}
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
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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


