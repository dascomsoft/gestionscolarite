// import React, { useState, useEffect } from 'react'
// import { User, Calendar, DollarSign, FileText, ArrowLeft, Edit, Trash2, Plus, CheckCircle, Clock } from 'lucide-react'
// import { formatCurrency, formatDate, formatTime } from '../lib/format'
// import { getFees } from '../lib/fees'
// import '../Styles/StudentDetail.css'

// export function StudentDetail({ student, navigateTo, onContinuePayment }) {
//   const [payments, setPayments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [editForm, setEditForm] = useState({
//     name: '',
//     class: '',
//     section: '',
//     schoolYear: ''
//   })


//       useEffect(() =>{
//         window.scrollTo(0,0)
//       },[])
    

//   const getStudentSchoolYear = (studentOrForm) => {
//     const currentYear = new Date().getFullYear();
//     return (
//       studentOrForm?.schoolYear ||
//       `${currentYear}/${currentYear + 1}`
//     );
//   };

//   useEffect(() => {
//     if (student) {
//       loadPayments();
//       setEditForm({
//         name: student.name,
//         class: student.class,
//         section: student.section,
//         schoolYear: getStudentSchoolYear(student),
//       });
//     }
//   }, [student]);

//   const loadPayments = async () => {
//     try {
//       setLoading(true);
//       const result = await window.electronAPI.database.invoke('getStudentPayments', student.id);
      
//       if (result.success) {
//         setPayments(result.result || []);
//       } else {
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       console.error('Erreur lors du chargement des paiements:', error);
//       setPayments([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // CORRECTION: Calculer correctement les montants déjà payés par type de frais
//   const getAlreadyPaidAmounts = () => {
//     const alreadyPaid = {
//       inscription: 0,
//       pension_0: 0,
//       pension_1: 0,
//       pension_2: 0
//     }

//     payments.forEach(payment => {
//       if (payment.paidAmounts) {
//         alreadyPaid.inscription += payment.paidAmounts.inscription || 0
//         alreadyPaid.pension_0 += payment.paidAmounts.pension_0 || 0
//         alreadyPaid.pension_1 += payment.paidAmounts.pension_1 || 0
//         alreadyPaid.pension_2 += payment.paidAmounts.pension_2 || 0
//       }
//     })

//     return alreadyPaid
//   }

//   // CORRECTION: Calculer le montant total d'un paiement spécifique
//   const calculatePaymentTotal = (payment) => {
//     if (!payment.paidAmounts) return 0;
    
//     return Object.values(payment.paidAmounts).reduce((sum, amount) => {
//       return sum + (parseFloat(amount) || 0);
//     }, 0);
//   }

//   // CORRECTION: Calculer le total payé à partir des paidAmounts, pas de totalPaid
//   const calculateTotalPaid = () => {
//     const alreadyPaid = getAlreadyPaidAmounts();
//     return Object.values(alreadyPaid).reduce((sum, amount) => sum + amount, 0);
//   }

//   const calculateTotalFees = () => {
//     if (!student) return 0
    
//     const fees = getFees(student.section, student.class)
//     if (!fees) return 0

//     const inscription = fees.inscription || 0
//     const pensionTotal = fees.pension ? fees.pension.reduce((sum, item) => sum + (item.amount || 0), 0) : 0
    
//     return inscription + pensionTotal
//   }

//   const calculateRemaining = () => {
//     return Math.max(0, calculateTotalFees() - calculateTotalPaid())
//   }

//   const handleDeleteStudent = async () => {
//     if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'élève "${student.name}" ? Cette action est irréversible.`)) {
//       try {
//         const paymentsResult = await window.electronAPI.database.invoke('getStudentPayments', student.id);
        
//         if (paymentsResult.success) {
//           for (const payment of paymentsResult.result) {
//             await window.electronAPI.database.invoke('deletePayment', payment.id);
//           }
//         }

//         const deleteResult = await window.electronAPI.database.invoke('deleteStudent', student.id);
        
//         if (deleteResult.success) {
//           alert('Élève supprimé avec succès');
//           navigateTo('students');
//         } else {
//           throw new Error(deleteResult.error);
//         }
//       } catch (error) {
//         console.error('Erreur lors de la suppression:', error);
//         alert('Erreur lors de la suppression de l\'élève: ' + error.message);
//       }
//     }
//   }

//   const handleEditStudent = async (e) => {
//     e.preventDefault();
//     try {
//       const result = await window.electronAPI.database.invoke('updateStudent',
//         student.id,
//         editForm.name,
//         editForm.class,
//         editForm.section,
//         editForm.schoolYear
//       );
      
//       if (result.success && result.result) {
//         setShowEditModal(false);
//         alert('Élève modifié avec succès');
//         loadPayments();
//       } else {
//         throw new Error(result.error || 'Erreur lors de la modification');
//       }
//     } catch (error) {
//       console.error('Erreur lors de la modification:', error);
//       alert('Erreur lors de la modification de l\'élève: ' + error.message);
//     }
//   }

//   const handlePrintHistory = () => {
//     window.print();
//   }

//   const handleContinuePayment = () => {
//     if (onContinuePayment) {
//       onContinuePayment(student);
//     }
//   }

//   const getFeeDetails = () => {
//     if (!student) return null;
//     return getFees(student.section, student.class);
//   }

//   const feeDetails = getFeeDetails();
//   const totalFees = calculateTotalFees();
//   const alreadyPaidAmounts = getAlreadyPaidAmounts();
//   const totalPaid = calculateTotalPaid();
//   const remaining = calculateRemaining();
//   const isFullyPaid = remaining <= 0;
//   const progressPercentage = totalFees > 0 ? Math.min(100, (totalPaid / totalFees) * 100) : 0;

//   if (!student) {
//     return (
//       <div className="student-not-found">
//         <div className="not-found-content">
//           <h1 className="not-found-title">Élève non trouvé</h1>
//           <button
//             onClick={() => navigateTo('students')}
//             className="not-found-button"
//           >
//             Retour à la liste
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="student-detail-container">
//       <div className="student-header-card">
//         <div className="header-content">
//           <div className="student-info-main">
//             <div className="student-avatar-large">
//               <User className="avatar-icon-large" />
//             </div>
//             <div className="student-details-main">
//               <div className="student-name-header">
//                 <h1 className="student-name-title">{student.name}</h1>
//                 {isFullyPaid && (
//                   <div className="student-status-badge fully-paid">
//                     <CheckCircle className="status-icon" />
//                     SCOLARITÉ SOLDÉE
//                   </div>
//                 )}
//               </div>
//               <div className="student-meta-grid">
//                 <div className="meta-item">
//                   <span className="meta-label">Classe:</span>
//                   <span className="class-badge">
//                     {student.class}
//                   </span>
//                 </div>
//                 <div className="meta-item">
//                   <span className="meta-label">Matricule:</span>
//                   {student.matricule || 'N/A'}
//                 </div>
//                 <div className="meta-item">
//                   <span className="meta-label">Section:</span>
//                   {student.section === 'im1' ? 'Francophone' : 'Anglophone'}
//                 </div>
//                 <div className="meta-item">
//                   <Calendar className="meta-icon" />
//                   <span className="meta-label">Année scolaire:</span>
//                   {getStudentSchoolYear(student)}
//                 </div>
//               </div>
//               {feeDetails && (
//                 <div className="fee-summary">
//                   <span className="fee-label">Frais: </span>
//                   Inscription: {formatCurrency(feeDetails.inscription)} + 
//                   {feeDetails.pension?.map((item, index) => (
//                     <span key={index}> {item.tranche}: {formatCurrency(item.amount)}{index < feeDetails.pension.length - 1 ? ' +' : ''}</span>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="header-actions">
//             <div className="total-paid-display">
//               <div className="total-amount">{formatCurrency(totalPaid)}</div>
//               <div className="total-label">Total payé</div>
//               {isFullyPaid && (
//                 <div className="fully-paid-indicator">
//                   Scolarité entièrement payée
//                 </div>
//               )}
//             </div>

//             <div className="action-buttons">
//               {!isFullyPaid ? (
//                 <button
//                   onClick={handleContinuePayment}
//                   className="continue-payment-button"
//                 >
//                   <DollarSign className="button-icon" />
//                   Poursuivre paiement
//                 </button>
//               ) : (
//                 <div className="fully-paid-button">
//                   <CheckCircle className="button-icon" />
//                   Scolarité soldée
//                 </div>
//               )}
//               <button
//                 onClick={() => setShowEditModal(true)}
//                 className="edit-button"
//               >
//                 <Edit className="button-icon" />
//                 Modifier
//               </button>
//               <button
//                 onClick={handleDeleteStudent}
//                 className="delete-button"
//               >
//                 <Trash2 className="button-icon" />
//                 Supprimer
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showEditModal && (
//         <div className="modal-overlay">
//           <div className="edit-modal">
//             <h3 className="modal-title">Modifier l'élève</h3>
//             <form onSubmit={handleEditStudent}>
//               <div className="form-fields">
//                 <div className="form-field">
//                   <label className="field-label">
//                     Nom complet
//                   </label>
//                   <input
//                     type="text"
//                     value={editForm.name}
//                     onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
//                     className="field-input"
//                     required
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label className="field-label">
//                     Classe
//                   </label>
//                   <input
//                     type="text"
//                     value={editForm.class}
//                     onChange={(e) => setEditForm(prev => ({ ...prev, class: e.target.value }))}
//                     className="field-input"
//                     required
//                   />
//                 </div>
//                 <div className="form-field">
//                   <label className="field-label">
//                     Section
//                   </label>
//                   <select
//                     value={editForm.section}
//                     onChange={(e) => setEditForm(prev => ({ ...prev, section: e.target.value }))}
//                     className="field-input"
//                     required
//                   >
//                     <option value="im1">Francophone</option>
//                     <option value="im2">Anglophone</option>
//                   </select>
//                 </div>
//                 <div className="form-field">
//                   <label className="field-label">
//                     Année scolaire
//                   </label>
//                   <input
//                     type="text"
//                     value={editForm.schoolYear}
//                     onChange={(e) => setEditForm(prev => ({ ...prev, schoolYear: e.target.value }))}
//                     className="field-input"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="modal-actions">
//                 <button
//                   type="button"
//                   onClick={() => setShowEditModal(false)}
//                   className="cancel-button"
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   className="save-button"
//                 >
//                   Enregistrer
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <div className="financial-summary">
//         <div className="summary-card">
//           <DollarSign className="summary-icon blue" />
//           <div className="summary-amount">{formatCurrency(totalFees)}</div>
//           <div className="summary-label">Frais totaux</div>
//         </div>

//         <div className="summary-card">
//           <FileText className="summary-icon green" />
//           <div className="summary-amount">{formatCurrency(totalPaid)}</div>
//           <div className="summary-label">Total payé</div>
//           <div className="summary-details">
//             {payments.length} paiement{payments.length !== 1 ? 's' : ''}
//           </div>
//         </div>

//         <div className="summary-card">
//           <Calendar className={`summary-icon ${isFullyPaid ? 'green' : 'orange'}`} />
//           <div className="summary-amount">{formatCurrency(remaining)}</div>
//           <div className="summary-label">Reste à payer</div>
//           <div className={`summary-details ${isFullyPaid ? 'status-paid' : 'status-pending'}`}>
//             {isFullyPaid ? 'SOLDÉ' : 'En cours'}
//           </div>
//         </div>
//       </div>

//       <div className="payments-history-card">
//         <div className="history-header">
//           <h2 className="history-title">Historique des paiements</h2>
//           <button
//             onClick={handlePrintHistory}
//             className="print-button"
//           >
//             Imprimer l'historique
//           </button>
//         </div>

//         {loading ? (
//           <div className="loading-payments">
//             <div className="loading-spinner"></div>
//             <p className="loading-text">Chargement des paiements...</p>
//           </div>
//         ) : payments.length === 0 ? (
//           <div className="empty-payments">
//             <FileText className="empty-icon" />
//             <h3 className="empty-title">Aucun paiement</h3>
//             <p className="empty-description">Aucun paiement n'a été enregistré pour cet élève.</p>
//           </div>
//         ) : (
//           <div className="payments-table-container">
//             <table className="payments-table">
//               <thead className="table-header">
//                 <tr>
//                   <th className="table-head">N° Reçu</th>
//                   <th className="table-head">Date</th>
//                   <th className="table-head">Heure</th>
//                   <th className="table-head amount-head">Montant payé</th>
//                   <th className="table-head">Opérateur</th>
//                   <th className="table-head">Détails</th>
//                 </tr>
//               </thead>
//               <tbody className="table-body">
//                 {payments.map((payment) => {
//                   // CORRECTION: Calculer le montant réel du paiement
//                   const paymentTotal = calculatePaymentTotal(payment);
                  
//                   return (
//                     <tr key={payment.id} className="table-row">
//                       <td className="receipt-cell">{payment.receiptNumber}</td>
//                       <td className="date-cell">{formatDate(payment.date)}</td>
//                       <td className="time-cell">
//                         <div className="time-info">
//                           <Clock className="time-icon" />
//                           {formatTime(payment.date)}
//                         </div>
//                       </td>
//                       <td className="amount-cell">{formatCurrency(paymentTotal)}</td>
//                       <td className="operator-cell">{payment.operator || 'Administrateur'}</td>
//                       <td className="details-cell">
//                         <div className="payment-details">
//                           {payment.paidAmounts?.inscription > 0 && (
//                             <span className="detail-badge inscription">
//                               Inscription: {formatCurrency(payment.paidAmounts.inscription)}
//                             </span>
//                           )}
//                           {payment.paidAmounts && Object.keys(payment.paidAmounts)
//                             .filter(key => key.startsWith('pension_'))
//                             .map((key, index) => (
//                               payment.paidAmounts[key] > 0 && (
//                                 <span key={key} className="detail-badge pension">
//                                   Tranche {index + 1}: {formatCurrency(payment.paidAmounts[key])}
//                                 </span>
//                               )
//                             ))
//                           }
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <div className="navigation-actions">
//         <button
//           onClick={() => navigateTo('students')}
//           className="back-button"
//         >
//           <ArrowLeft className="button-icon" />
//           Retour à la liste
//         </button>

//         <button
//           onClick={() => navigateTo('payment')}
//           className="new-payment-button"
//         >
//           <Plus className="button-icon" />
//           Nouveau paiement
//         </button>
//       </div>
//     </div>
//   )
// }




























































































import React, { useState, useEffect } from 'react'
import { User, Calendar, DollarSign, FileText, ArrowLeft, Edit, Trash2, Plus, CheckCircle, Clock } from 'lucide-react'
import { formatCurrency, formatDate, formatTime } from '../lib/format'
import { getFees } from '../lib/fees'
import '../Styles/StudentDetail.css'

export function StudentDetail({ student, navigateTo, onContinuePayment }) {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    class: '',
    section: '',
    schoolYear: ''
  })


      useEffect(() =>{
        window.scrollTo(0,0)
      },[])
    

  const getStudentSchoolYear = (studentOrForm) => {
    const currentYear = new Date().getFullYear();
    return (
      studentOrForm?.schoolYear ||
      `${currentYear}/${currentYear + 1}`
    );
  };

  useEffect(() => {
    if (student) {
      loadPayments();
      setEditForm({
        name: student.name,
        class: student.class,
        section: student.section,
        schoolYear: getStudentSchoolYear(student),
      });
    }
  }, [student]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const result = await window.electronAPI.database.invoke('getStudentPayments', student.id);
      
      if (result.success) {
        setPayments(result.result || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  // CORRECTION: Ajouter fraisAnnexes dans les calculs
  const getAlreadyPaidAmounts = () => {
    const alreadyPaid = {
      inscription: 0,
      fraisAnnexes: 0, // AJOUT
      pension_0: 0,
      pension_1: 0,
      pension_2: 0
    }

    payments.forEach(payment => {
      if (payment.paidAmounts) {
        alreadyPaid.inscription += payment.paidAmounts.inscription || 0
        alreadyPaid.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0 // AJOUT
        alreadyPaid.pension_0 += payment.paidAmounts.pension_0 || 0
        alreadyPaid.pension_1 += payment.paidAmounts.pension_1 || 0
        alreadyPaid.pension_2 += payment.paidAmounts.pension_2 || 0
      }
    })

    return alreadyPaid
  }

  // CORRECTION: Calculer le montant total d'un paiement spécifique
  const calculatePaymentTotal = (payment) => {
    if (!payment.paidAmounts) return 0;
    
    return Object.values(payment.paidAmounts).reduce((sum, amount) => {
      return sum + (parseFloat(amount) || 0);
    }, 0);
  }

  // CORRECTION: Calculer le total payé à partir des paidAmounts, pas de totalPaid
  const calculateTotalPaid = () => {
    const alreadyPaid = getAlreadyPaidAmounts();
    return Object.values(alreadyPaid).reduce((sum, amount) => sum + amount, 0);
  }

  const calculateTotalFees = () => {
    if (!student) return 0
    
    const fees = getFees(student.section, student.class)
    if (!fees) return 0

    // CORRECTION: Inclure fraisAnnexes dans le calcul
    const inscription = fees.inscription || 0
    const fraisAnnexes = fees.fraisAnnexes || 0
    const pensionTotal = fees.pension ? fees.pension.reduce((sum, item) => sum + (item.amount || 0), 0) : 0
    
    return inscription + fraisAnnexes + pensionTotal
  }

  const calculateRemaining = () => {
    return Math.max(0, calculateTotalFees() - calculateTotalPaid())
  }

  const handleDeleteStudent = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'élève "${student.name}" ? Cette action est irréversible.`)) {
      try {
        const paymentsResult = await window.electronAPI.database.invoke('getStudentPayments', student.id);
        
        if (paymentsResult.success) {
          for (const payment of paymentsResult.result) {
            await window.electronAPI.database.invoke('deletePayment', payment.id);
          }
        }

        const deleteResult = await window.electronAPI.database.invoke('deleteStudent', student.id);
        
        if (deleteResult.success) {
          alert('Élève supprimé avec succès');
          navigateTo('students');
        } else {
          throw new Error(deleteResult.error);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'élève: ' + error.message);
      }
    }
  }

  const handleEditStudent = async (e) => {
    e.preventDefault();
    try {
      const result = await window.electronAPI.database.invoke('updateStudent',
        student.id,
        editForm.name,
        editForm.class,
        editForm.section,
        editForm.schoolYear
      );
      
      if (result.success && result.result) {
        setShowEditModal(false);
        alert('Élève modifié avec succès');
        loadPayments();
      } else {
        throw new Error(result.error || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert('Erreur lors de la modification de l\'élève: ' + error.message);
    }
  }

  const handlePrintHistory = () => {
    window.print();
  }

  const handleContinuePayment = () => {
    if (onContinuePayment) {
      onContinuePayment(student);
    }
  }

  const getFeeDetails = () => {
    if (!student) return null;
    return getFees(student.section, student.class);
  }

  const feeDetails = getFeeDetails();
  const totalFees = calculateTotalFees();
  const alreadyPaidAmounts = getAlreadyPaidAmounts();
  const totalPaid = calculateTotalPaid();
  const remaining = calculateRemaining();
  const isFullyPaid = remaining <= 0;
  const progressPercentage = totalFees > 0 ? Math.min(100, (totalPaid / totalFees) * 100) : 0;

  if (!student) {
    return (
      <div className="student-not-found">
        <div className="not-found-content">
          <h1 className="not-found-title">Élève non trouvé</h1>
          <button
            onClick={() => navigateTo('students')}
            className="not-found-button"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-detail-container">
      <div className="student-header-card">
        <div className="header-content">
          <div className="student-info-main">
            <div className="student-avatar-large">
              <User className="avatar-icon-large" />
            </div>
            <div className="student-details-main">
              <div className="student-name-header">
                <h1 className="student-name-title">{student.name}</h1>
                {isFullyPaid && (
                  <div className="student-status-badge fully-paid">
                    <CheckCircle className="status-icon" />
                    SCOLARITÉ SOLDÉE
                  </div>
                )}
              </div>
              <div className="student-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Classe:</span>
                  <span className="class-badge">
                    {student.class}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Matricule:</span>
                  {student.matricule || 'N/A'}
                </div>
                <div className="meta-item">
                  <span className="meta-label">Section:</span>
                  {student.section === 'im1' ? 'Francophone' : 'Anglophone'}
                </div>
                <div className="meta-item">
                  <Calendar className="meta-icon" />
                  <span className="meta-label">Année scolaire:</span>
                  {getStudentSchoolYear(student)}
                </div>
              </div>
              {feeDetails && (
                <div className="fee-summary">
                  <span className="fee-label">Frais: </span>
                  Inscription: {formatCurrency(feeDetails.inscription)} + 
                  Frais annexes: {formatCurrency(feeDetails.fraisAnnexes || 0)} + 
                  {feeDetails.pension?.map((item, index) => (
                    <span key={index}> {item.tranche}: {formatCurrency(item.amount)}{index < feeDetails.pension.length - 1 ? ' +' : ''}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="header-actions">
            <div className="total-paid-display">
              <div className="total-amount">{formatCurrency(totalPaid)}</div>
              <div className="total-label">Total payé</div>
              {isFullyPaid && (
                <div className="fully-paid-indicator">
                  Scolarité entièrement payée
                </div>
              )}
            </div>

            <div className="action-buttons">
              {!isFullyPaid ? (
                <button
                  onClick={handleContinuePayment}
                  className="continue-payment-button"
                >
                  <DollarSign className="button-icon" />
                  Poursuivre paiement
                </button>
              ) : (
                <div className="fully-paid-button">
                  <CheckCircle className="button-icon" />
                  Scolarité soldée
                </div>
              )}
              <button
                onClick={() => setShowEditModal(true)}
                className="edit-button"
              >
                <Edit className="button-icon" />
                Modifier
              </button>
              <button
                onClick={handleDeleteStudent}
                className="delete-button"
              >
                <Trash2 className="button-icon" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h3 className="modal-title">Modifier l'élève</h3>
            <form onSubmit={handleEditStudent}>
              <div className="form-fields">
                <div className="form-field">
                  <label className="field-label">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="field-input"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">
                    Classe
                  </label>
                  <input
                    type="text"
                    value={editForm.class}
                    onChange={(e) => setEditForm(prev => ({ ...prev, class: e.target.value }))}
                    className="field-input"
                    required
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">
                    Section
                  </label>
                  <select
                    value={editForm.section}
                    onChange={(e) => setEditForm(prev => ({ ...prev, section: e.target.value }))}
                    className="field-input"
                    required
                  >
                    <option value="im1">Francophone</option>
                    <option value="im2">Anglophone</option>
                  </select>
                </div>
                <div className="form-field">
                  <label className="field-label">
                    Année scolaire
                  </label>
                  <input
                    type="text"
                    value={editForm.schoolYear}
                    onChange={(e) => setEditForm(prev => ({ ...prev, schoolYear: e.target.value }))}
                    className="field-input"
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="cancel-button"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="save-button"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="financial-summary">
        <div className="summary-card">
          <DollarSign className="summary-icon blue" />
          <div className="summary-amount">{formatCurrency(totalFees)}</div>
          <div className="summary-label">Frais totaux</div>
        </div>

        <div className="summary-card">
          <FileText className="summary-icon green" />
          <div className="summary-amount">{formatCurrency(totalPaid)}</div>
          <div className="summary-label">Total payé</div>
          <div className="summary-details">
            {payments.length} paiement{payments.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="summary-card">
          <Calendar className={`summary-icon ${isFullyPaid ? 'green' : 'orange'}`} />
          <div className="summary-amount">{formatCurrency(remaining)}</div>
          <div className="summary-label">Reste à payer</div>
          <div className={`summary-details ${isFullyPaid ? 'status-paid' : 'status-pending'}`}>
            {isFullyPaid ? 'SOLDÉ' : 'En cours'}
          </div>
        </div>
      </div>

      <div className="payments-history-card">
        <div className="history-header">
          <h2 className="history-title">Historique des paiements</h2>
          <button
            onClick={handlePrintHistory}
            className="print-button"
          >
            Imprimer l'historique
          </button>
        </div>

        {loading ? (
          <div className="loading-payments">
            <div className="loading-spinner"></div>
            <p className="loading-text">Chargement des paiements...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="empty-payments">
            <FileText className="empty-icon" />
            <h3 className="empty-title">Aucun paiement</h3>
            <p className="empty-description">Aucun paiement n'a été enregistré pour cet élève.</p>
          </div>
        ) : (
          <div className="payments-table-container">
            <table className="payments-table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">N° Reçu</th>
                  <th className="table-head">Date</th>
                  <th className="table-head">Heure</th>
                  <th className="table-head amount-head">Montant payé</th>
                  <th className="table-head">Opérateur</th>
                  <th className="table-head">Détails</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {payments.map((payment) => {
                  // CORRECTION: Calculer le montant réel du paiement
                  const paymentTotal = calculatePaymentTotal(payment);
                  
                  return (
                    <tr key={payment.id} className="table-row">
                      <td className="receipt-cell">{payment.receiptNumber}</td>
                      <td className="date-cell">{formatDate(payment.date)}</td>
                      <td className="time-cell">
                        <div className="time-info">
                          <Clock className="time-icon" />
                          {formatTime(payment.date)}
                        </div>
                      </td>
                      <td className="amount-cell">{formatCurrency(paymentTotal)}</td>
                      <td className="operator-cell">{payment.operator || 'Administrateur'}</td>
                      <td className="details-cell">
                        <div className="payment-details">
                          {payment.paidAmounts?.inscription > 0 && (
                            <span className="detail-badge inscription">
                              Inscription: {formatCurrency(payment.paidAmounts.inscription)}
                            </span>
                          )}
                          {payment.paidAmounts?.fraisAnnexes > 0 && (
                            <span className="detail-badge frais-annexes">
                              Frais annexes: {formatCurrency(payment.paidAmounts.fraisAnnexes)}
                            </span>
                          )}
                          {payment.paidAmounts && Object.keys(payment.paidAmounts)
                            .filter(key => key.startsWith('pension_'))
                            .map((key, index) => (
                              payment.paidAmounts[key] > 0 && (
                                <span key={key} className="detail-badge pension">
                                  Tranche {index + 1}: {formatCurrency(payment.paidAmounts[key])}
                                </span>
                              )
                            ))
                          }
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="navigation-actions">
        <button
          onClick={() => navigateTo('students')}
          className="back-button"
        >
          <ArrowLeft className="button-icon" />
          Retour à la liste
        </button>

        <button
          onClick={() => navigateTo('payment')}
          className="new-payment-button"
        >
          <Plus className="button-icon" />
          Nouveau paiement
        </button>
      </div>
    </div>
  )
}