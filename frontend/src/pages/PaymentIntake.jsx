





// import React, { useState, useEffect } from 'react'
// import { FeeTable } from '../components/FeeTable'
// import { ReceiptPreview } from '../components/ReceiptPreview'
// import { getFees } from '../lib/fees'
// import { formatCurrency, generateReceiptNumber, generateMatricule } from '../lib/format'
// import '../Styles/PaymentIntake.css'

// export function PaymentIntake({ section, className, onPaymentComplete, navigateTo, user, existingStudent }) {

//   const getDefaultSchoolYear = () => {
//     const currentYear = new Date().getFullYear()
//     return `${currentYear}/${currentYear + 1}`
//   }

//   const [step, setStep] = useState('form')
//   const [studentData, setStudentData] = useState({
//     name: '',
//     schoolYear: getDefaultSchoolYear()
//   })
//   const [paidAmounts, setPaidAmounts] = useState({
//     inscription: '',
//     pension_0: '',
//     pension_1: '',
//     pension_2: ''
//   })
//   const [receiptData, setReceiptData] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [existingPayments, setExistingPayments] = useState([])
//   const [alreadyPaidAmounts, setAlreadyPaidAmounts] = useState({
//     inscription: 0,
//     pension_0: 0,
//     pension_1: 0,
//     pension_2: 0
//   })

//   const fees = getFees(section, className)

//   useEffect(() => {
//     if (existingStudent) {
//       setStudentData({
//         name: existingStudent.name,
//         schoolYear: existingStudent.schoolYear || getDefaultSchoolYear()
//       })
//       loadExistingPayments(existingStudent.id)
//     } else {
//       setStudentData({ name: '', schoolYear: getDefaultSchoolYear() })
//       setPaidAmounts({ inscription: '', pension_0: '', pension_1: '', pension_2: '' })
//       setExistingPayments([])
//       setAlreadyPaidAmounts({ inscription: 0, pension_0: 0, pension_1: 0, pension_2: 0 })
//     }
//   }, [existingStudent])

//   const loadExistingPayments = async (studentId) => {
//     try {
//       const result = await window.electronAPI.database.invoke('getStudentPayments', studentId)
      
//       if (result.success) {
//         setExistingPayments(result.result)
        
//         // Calculer les montants déjà payés par type de frais
//         const paid = {
//           inscription: 0,
//           pension_0: 0,
//           pension_1: 0,
//           pension_2: 0
//         }
        
//         result.result.forEach(payment => {
//           if (payment.paidAmounts) {
//             paid.inscription += payment.paidAmounts.inscription || 0
//             paid.pension_0 += payment.paidAmounts.pension_0 || 0
//             paid.pension_1 += payment.paidAmounts.pension_1 || 0
//             paid.pension_2 += payment.paidAmounts.pension_2 || 0
//           }
//         })
        
//         setAlreadyPaidAmounts(paid)
//         setPaidAmounts({
//           inscription: '',
//           pension_0: '',
//           pension_1: '',
//           pension_2: ''
//         })
//       } else {
//         throw new Error(result.error)
//       }

//     } catch (error) {
//       console.error('Erreur lors du chargement des paiements existants:', error)
//     }
//   }

//   const handleStudentDataChange = (e) => {
//     setStudentData(prev => ({ ...prev, [e.target.name]: e.target.value }))
//   }

//   const handleAmountChange = (field, value) => {
//     if (value && isNaN(value)) return
    
//     // Vérifier si le frais a déjà été entièrement payé
//     const feeKey = field === 'inscription' ? 'inscription' : 
//                   field === 'pension_0' ? 'pension_0' :
//                   field === 'pension_1' ? 'pension_1' : 'pension_2'
    
//     const feeAmount = field === 'inscription' ? fees.inscription : 
//                      fees.pension[field === 'pension_0' ? 0 : field === 'pension_1' ? 1 : 2].amount
    
//     const alreadyPaid = alreadyPaidAmounts[feeKey] || 0
//     const remaining = feeAmount - alreadyPaid
    
//     if (remaining <= 0) {
//       alert('Ce frais a déjà été entièrement payé.')
//       return
//     }
    
//     const newAmount = parseFloat(value) || 0
//     if (newAmount > remaining) {
//       alert(`Le montant saisi dépasse le reste à payer (${formatCurrency(remaining)})`)
//       return
//     }
    
//     setPaidAmounts(prev => ({ ...prev, [field]: value }))
//   }

//   const calculateTotals = () => {
//     if (!fees) return { totalDue: 0, totalPaid: 0, remaining: 0, existingTotal: 0, newPaymentTotal: 0, isFullyPaid: false }

//     const totalDue = fees.inscription + fees.pension.reduce((sum, item) => sum + item.amount, 0)
    
//     const existingTotal = Object.values(alreadyPaidAmounts).reduce((sum, amount) => sum + amount, 0)
    
//     const newPaymentTotal = Object.values(paidAmounts).reduce((sum, amount) => {
//       const numAmount = parseFloat(amount) || 0
//       return sum + numAmount
//     }, 0)
    
//     const totalPaid = existingTotal + newPaymentTotal
//     const remaining = totalDue - totalPaid
//     const isFullyPaid = remaining <= 0

//     return { totalDue, totalPaid, remaining, existingTotal, newPaymentTotal, isFullyPaid }
//   }

//   const isFieldAlreadyPaid = (field) => {
//     const feeKey = field === 'inscription' ? 'inscription' : 
//                   field === 'pension_0' ? 'pension_0' :
//                   field === 'pension_1' ? 'pension_1' : 'pension_2'
    
//     const feeAmount = field === 'inscription' ? fees.inscription : 
//                      fees.pension[field === 'pension_0' ? 0 : field === 'pension_1' ? 1 : 2].amount
    
//     const alreadyPaid = alreadyPaidAmounts[feeKey] || 0
//     return alreadyPaid >= feeAmount
//   }

//   const handleSave = async () => {
//     if (!studentData.name.trim()) {
//       alert('Veuillez saisir le nom de l\'élève')
//       return
//     }

//     const { newPaymentTotal, isFullyPaid } = calculateTotals()
    
//     const hasNewPayment = Object.values(paidAmounts).some(amount => 
//       amount && parseFloat(amount) > 0
//     )
    
//     if (!hasNewPayment) {
//       alert('Veuillez saisir au moins un montant à payer')
//       return
//     }

//     setLoading(true)
//     try {
//       let student
//       if (existingStudent) {
//         student = existingStudent
//       } else {
//         const result = await window.electronAPI.database.invoke('createStudent',
//           studentData.name,
//           className,
//           section,
//           studentData.schoolYear || getDefaultSchoolYear(),
//           generateMatricule(new Date().getFullYear(), Math.floor(Math.random() * 1000))
//         )
        
//         if (!result.success) throw new Error(result.error)
//         student = result.result
//       }

//       const operatorName = user?.name || user?.email || 'Administrateur'
//       const receiptNumber = generateReceiptNumber()
      
//       const paymentData = {
//         studentId: student.id,
//         studentName: studentData.name,
//         className: className,
//         section: section,
//         schoolYear: studentData.schoolYear || getDefaultSchoolYear(),
//         paidAmounts: {
//           inscription: parseFloat(paidAmounts.inscription) || 0,
//           pension_0: parseFloat(paidAmounts.pension_0) || 0,
//           pension_1: parseFloat(paidAmounts.pension_1) || 0,
//           pension_2: parseFloat(paidAmounts.pension_2) || 0
//         },
//         totalPaid: newPaymentTotal,
//         receiptNumber: receiptNumber,
//         operator: operatorName,
//         date: new Date().toISOString()
//       }

//       const paymentResult = await window.electronAPI.database.invoke('createPayment',
//         paymentData.studentId,
//         paymentData.studentName,
//         paymentData.className,
//         paymentData.section,
//         paymentData.schoolYear,
//         paymentData.paidAmounts,
//         paymentData.totalPaid,
//         paymentData.receiptNumber,
//         paymentData.operator
//       )

//       if (!paymentResult.success) throw new Error(paymentResult.error)

//       // CORRECTION : NE PAS METTRE À JOUR alreadyPaidAmounts ici
//       // Garder les anciennes valeurs pour ReceiptPreview
//       console.log('🔄 Anciens alreadyPaidAmounts conservés:', alreadyPaidAmounts);
//       console.log('💰 Nouveau paiement à ajouter:', paymentData.paidAmounts);
//       console.log('🧮 Total du nouveau paiement:', newPaymentTotal);

//       setReceiptData({
//         ...paymentResult.result,
//         operator: operatorName,
//         paidAmounts: paymentData.paidAmounts,
//         receiptNumber: receiptNumber,
//         date: new Date().toISOString(),
//         isExistingStudent: !!existingStudent,
//         totalPaid: newPaymentTotal
//       })

//       // NE PAS appeler setAlreadyPaidAmounts ici
//       // NE PAS appeler loadExistingPayments ici
      
//       setStep('preview')
      
//     } catch (error) {
//       console.error('Erreur lors de la sauvegarde:', error)
//       alert('Erreur lors de la sauvegarde des données: ' + error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePrint = () => window.print()

//   const handleNewPayment = () => {
//     setStep('form')
//     if (!existingStudent) {
//       setStudentData({ name: '', schoolYear: getDefaultSchoolYear() })
//       setPaidAmounts({ inscription: '', pension_0: '', pension_1: '', pension_2: '' })
//       setExistingPayments([])
//       setAlreadyPaidAmounts({ inscription: 0, pension_0: 0, pension_1: 0, pension_2: 0 })
//     } else {
//       setPaidAmounts({ inscription: '', pension_0: '', pension_1: '', pension_2: '' })
//       // Recharger les paiements existants pour mettre à jour l'interface
//       loadExistingPayments(existingStudent.id)
//     }
//     setReceiptData(null)
//   }

//   const handleContinue = () => onPaymentComplete()

//   const { totalDue, totalPaid, remaining, existingTotal, newPaymentTotal, isFullyPaid } = calculateTotals()

//     useEffect(() =>{
//     window.scrollTo(0,0)
//   },[])


//   if (!fees) {
//     return (
//       <div className="payment-intake-error">
//         <div className="error-content">
//           <h1 className="error-title">Données non disponibles</h1>
//           <button onClick={() => navigateTo('palier')} className="error-button">
//             Retour au choix de classe
//           </button>
//         </div>
//       </div>
//     )
//   }

//   if (step === 'preview' && receiptData) {
//     console.log('🔄 PaymentIntake - alreadyPaidAmounts pour ReceiptPreview:', alreadyPaidAmounts);
//     console.log('🔄 PaymentIntake - receiptData.paidAmounts:', receiptData.paidAmounts);
    
//     return (
//       <div className="payment-intake-preview">
//         <div className="preview-container">
//           <ReceiptPreview
//             receiptData={receiptData}
//             studentData={{
//               name: studentData.name,
//               class: className,
//               schoolYear: studentData.schoolYear,
//               matricule: existingStudent?.matricule || generateMatricule(new Date().getFullYear(), 1)
//             }}
//             fees={fees}
//             onPrint={handlePrint}
//             existingPayments={existingPayments}
//             alreadyPaidAmounts={alreadyPaidAmounts}
//           />
//           <div className="preview-actions">
//             <button onClick={handleNewPayment} className="preview-button secondary">
//               {existingStudent ? 'Nouveau paiement pour cet élève' : 'Nouveau paiement'}
//             </button>
//             <button onClick={handleContinue} className="preview-button primary">
//               Voir la liste des élèves
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="payment-intake-container">
//       {existingStudent && (
//         <div className="existing-student-banner">
//           <div className="banner-content">
//             <span className="banner-icon">↻</span>
//             <span className="banner-text">
//               Continuation de paiement pour {existingStudent.name} 
//               {existingStudent.matricule && ` (${existingStudent.matricule})`}
//             </span>
//           </div>
//           <div className="banner-info">
//             Montants déjà payés: 
//             Inscription: {formatCurrency(alreadyPaidAmounts.inscription)} | 
//             Tranche 1: {formatCurrency(alreadyPaidAmounts.pension_0)} | 
//             Tranche 2: {formatCurrency(alreadyPaidAmounts.pension_1)} | 
//             Tranche 3: {formatCurrency(alreadyPaidAmounts.pension_2)}
//           </div>
//         </div>
//       )}

//       <div className="student-info-card">
//         <h2 className="section-title">
//           {existingStudent ? 'Informations de l\'élève' : 'Nouvel élève'}
//         </h2>
//         <div className="student-form-grid">
//           <div className="form-field">
//             <label htmlFor="name" className="field-label">Nom complet de l'élève *</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={studentData.name}
//               onChange={handleStudentDataChange}
//               className="field-input"
//               placeholder="Saisir le nom complet"
//               required
//               disabled={!!existingStudent}
//             />
//           </div>
//           <div className="form-field">
//             <label htmlFor="schoolYear" className="field-label">Année scolaire</label>
//             <input
//               type="text"
//               id="schoolYear"
//               name="schoolYear"
//               value={studentData.schoolYear}
//               onChange={handleStudentDataChange}
//               className="field-input"
//               placeholder={getDefaultSchoolYear()}
//             />
//           </div>
//           <div className="form-field">
//             <label className="field-label">Section</label>
//             <input
//               type="text"
//               value={section === 'im1' ? 'Francophone' : 'Anglophone'}
//               className="field-input readonly"
//               readOnly
//             />
//           </div>
//           <div className="form-field">
//             <label className="field-label">Classe</label>
//             <input
//               type="text"
//               value={className}
//               className="field-input readonly"
//               readOnly
//             />
//           </div>
//         </div>
//       </div>

//       <FeeTable
//         fees={fees}
//         paidAmounts={paidAmounts}
//         onAmountChange={handleAmountChange}
//         isFieldDisabled={isFieldAlreadyPaid}
//         existingPayments={existingPayments}
//         alreadyPaidAmounts={alreadyPaidAmounts}
//       />

//       <div className="actions-footer">
//         <button onClick={() => navigateTo('palier')} className="footer-button secondary">Retour</button>
//         <div className="totals-container">
//           <div className="totals-display">
//             <p className="total-item">Total à payer: {formatCurrency(totalDue)}</p>
//             <p className="total-item">Déjà payé: {formatCurrency(existingTotal)}</p>
//             <p className="total-item">Nouveau paiement: {formatCurrency(newPaymentTotal)}</p>
//             <p className="total-item">Total payé: {formatCurrency(totalPaid)}</p>
//             <div className={`payment-status ${isFullyPaid ? 'fully-paid' : 'not-paid'}`}>
//               {isFullyPaid ? (
//                 <div className="fully-paid-badge">✅ SCOLARITÉ ENTIÈREMENT SOLDÉE</div>
//               ) : (
//                 <p className="total-remaining">Reste à payer: {formatCurrency(remaining)}</p>
//               )}
//             </div>
//           </div>
          
//           <button
//             onClick={handleSave}
//             disabled={loading || !studentData.name.trim() || newPaymentTotal <= 0}
//             className="footer-button primary"
//           >
//             {loading ? 'Sauvegarde...' : 
//              existingStudent ? 'Ajouter ce paiement' : 'Sauvegarder et continuer'}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }




















































import React, { useState, useEffect } from 'react'
import { FeeTable } from '../components/FeeTable'
import { ReceiptPreview } from '../components/ReceiptPreview'
import { getFees } from '../lib/fees'
import { formatCurrency, generateReceiptNumber, generateMatricule } from '../lib/format'
import '../Styles/PaymentIntake.css'

export function PaymentIntake({ section, className, onPaymentComplete, navigateTo, user, existingStudent }) {

  const getDefaultSchoolYear = () => {
    const currentYear = new Date().getFullYear()
    return `${currentYear}/${currentYear + 1}`
  }

  const [step, setStep] = useState('form')
  const [studentData, setStudentData] = useState({
    name: '',
    schoolYear: getDefaultSchoolYear()
  })
  const [paidAmounts, setPaidAmounts] = useState({
    inscription: '',
    fraisAnnexes: '', // AJOUT
    pension_0: '',
    pension_1: '',
    pension_2: ''
  })
  const [receiptData, setReceiptData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [existingPayments, setExistingPayments] = useState([])
  const [alreadyPaidAmounts, setAlreadyPaidAmounts] = useState({
    inscription: 0,
    fraisAnnexes: 0, // AJOUT
    pension_0: 0,
    pension_1: 0,
    pension_2: 0
  })

  const fees = getFees(section, className)

  useEffect(() => {
    if (existingStudent) {
      setStudentData({
        name: existingStudent.name,
        schoolYear: existingStudent.schoolYear || getDefaultSchoolYear()
      })
      loadExistingPayments(existingStudent.id)
    } else {
      setStudentData({ name: '', schoolYear: getDefaultSchoolYear() })
      setPaidAmounts({ inscription: '', fraisAnnexes: '', pension_0: '', pension_1: '', pension_2: '' }) // MODIFICATION
      setExistingPayments([])
      setAlreadyPaidAmounts({ inscription: 0, fraisAnnexes: 0, pension_0: 0, pension_1: 0, pension_2: 0 }) // MODIFICATION
    }
  }, [existingStudent])

  const loadExistingPayments = async (studentId) => {
    try {
      const result = await window.electronAPI.database.invoke('getStudentPayments', studentId)
      
      if (result.success) {
        setExistingPayments(result.result)
        
        // Calculer les montants déjà payés par type de frais
        const paid = {
          inscription: 0,
          fraisAnnexes: 0, // AJOUT
          pension_0: 0,
          pension_1: 0,
          pension_2: 0
        }
        
        result.result.forEach(payment => {
          if (payment.paidAmounts) {
            paid.inscription += payment.paidAmounts.inscription || 0
            paid.fraisAnnexes += payment.paidAmounts.fraisAnnexes || 0 // AJOUT
            paid.pension_0 += payment.paidAmounts.pension_0 || 0
            paid.pension_1 += payment.paidAmounts.pension_1 || 0
            paid.pension_2 += payment.paidAmounts.pension_2 || 0
          }
        })
        
        setAlreadyPaidAmounts(paid)
        setPaidAmounts({
          inscription: '',
          fraisAnnexes: '', // AJOUT
          pension_0: '',
          pension_1: '',
          pension_2: ''
        })
      } else {
        throw new Error(result.error)
      }

    } catch (error) {
      console.error('Erreur lors du chargement des paiements existants:', error)
    }
  }

  const handleStudentDataChange = (e) => {
    setStudentData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAmountChange = (field, value) => {
    if (value && isNaN(value)) return
    
    // Vérifier si le frais a déjà été entièrement payé
    const feeKey = field === 'inscription' ? 'inscription' : 
                  field === 'fraisAnnexes' ? 'fraisAnnexes' : // AJOUT
                  field === 'pension_0' ? 'pension_0' :
                  field === 'pension_1' ? 'pension_1' : 'pension_2'
    
    const feeAmount = field === 'inscription' ? fees.inscription : 
                     field === 'fraisAnnexes' ? (fees.fraisAnnexes || 0) : // AJOUT
                     fees.pension[field === 'pension_0' ? 0 : field === 'pension_1' ? 1 : 2].amount
    
    const alreadyPaid = alreadyPaidAmounts[feeKey] || 0
    const remaining = feeAmount - alreadyPaid
    
    if (remaining <= 0) {
      alert('Ce frais a déjà été entièrement payé.')
      return
    }
    
    const newAmount = parseFloat(value) || 0
    if (newAmount > remaining) {
      alert(`Le montant saisi dépasse le reste à payer (${formatCurrency(remaining)})`)
      return
    }
    
    setPaidAmounts(prev => ({ ...prev, [field]: value }))
  }

  const calculateTotals = () => {
    if (!fees) return { totalDue: 0, totalPaid: 0, remaining: 0, existingTotal: 0, newPaymentTotal: 0, isFullyPaid: false }

    const totalDue = fees.inscription + (fees.fraisAnnexes || 0) + fees.pension.reduce((sum, item) => sum + item.amount, 0) // MODIFICATION
    
    const existingTotal = Object.values(alreadyPaidAmounts).reduce((sum, amount) => sum + amount, 0)
    
    const newPaymentTotal = Object.values(paidAmounts).reduce((sum, amount) => {
      const numAmount = parseFloat(amount) || 0
      return sum + numAmount
    }, 0)
    
    const totalPaid = existingTotal + newPaymentTotal
    const remaining = totalDue - totalPaid
    const isFullyPaid = remaining <= 0

    return { totalDue, totalPaid, remaining, existingTotal, newPaymentTotal, isFullyPaid }
  }

  const isFieldAlreadyPaid = (field) => {
    const feeKey = field === 'inscription' ? 'inscription' : 
                  field === 'fraisAnnexes' ? 'fraisAnnexes' : // AJOUT
                  field === 'pension_0' ? 'pension_0' :
                  field === 'pension_1' ? 'pension_1' : 'pension_2'
    
    const feeAmount = field === 'inscription' ? fees.inscription : 
                     field === 'fraisAnnexes' ? (fees.fraisAnnexes || 0) : // AJOUT
                     fees.pension[field === 'pension_0' ? 0 : field === 'pension_1' ? 1 : 2].amount
    
    const alreadyPaid = alreadyPaidAmounts[feeKey] || 0
    return alreadyPaid >= feeAmount
  }

  const handleSave = async () => {
    if (!studentData.name.trim()) {
      alert('Veuillez saisir le nom de l\'élève')
      return
    }

    const { newPaymentTotal, isFullyPaid } = calculateTotals()
    
    const hasNewPayment = Object.values(paidAmounts).some(amount => 
      amount && parseFloat(amount) > 0
    )
    
    if (!hasNewPayment) {
      alert('Veuillez saisir au moins un montant à payer')
      return
    }

    setLoading(true)
    try {
      let student
      if (existingStudent) {
        student = existingStudent
      } else {
        const result = await window.electronAPI.database.invoke('createStudent',
          studentData.name,
          className,
          section,
          studentData.schoolYear || getDefaultSchoolYear(),
          generateMatricule(new Date().getFullYear(), Math.floor(Math.random() * 1000))
        )
        
        if (!result.success) throw new Error(result.error)
        student = result.result
      }

      const operatorName = user?.name || user?.email || 'Administrateur'
      const receiptNumber = generateReceiptNumber()
      
      const paymentData = {
        studentId: student.id,
        studentName: studentData.name,
        className: className,
        section: section,
        schoolYear: studentData.schoolYear || getDefaultSchoolYear(),
        paidAmounts: {
          inscription: parseFloat(paidAmounts.inscription) || 0,
          fraisAnnexes: parseFloat(paidAmounts.fraisAnnexes) || 0, // AJOUT
          pension_0: parseFloat(paidAmounts.pension_0) || 0,
          pension_1: parseFloat(paidAmounts.pension_1) || 0,
          pension_2: parseFloat(paidAmounts.pension_2) || 0
        },
        totalPaid: newPaymentTotal,
        receiptNumber: receiptNumber,
        operator: operatorName,
        date: new Date().toISOString()
      }

      const paymentResult = await window.electronAPI.database.invoke('createPayment',
        paymentData.studentId,
        paymentData.studentName,
        paymentData.className,
        paymentData.section,
        paymentData.schoolYear,
        paymentData.paidAmounts,
        paymentData.totalPaid,
        paymentData.receiptNumber,
        paymentData.operator
      )

      if (!paymentResult.success) throw new Error(paymentResult.error)

      // CORRECTION : NE PAS METTRE À JOUR alreadyPaidAmounts ici
      // Garder les anciennes valeurs pour ReceiptPreview
      console.log('🔄 Anciens alreadyPaidAmounts conservés:', alreadyPaidAmounts);
      console.log('💰 Nouveau paiement à ajouter:', paymentData.paidAmounts);
      console.log('🧮 Total du nouveau paiement:', newPaymentTotal);

      setReceiptData({
        ...paymentResult.result,
        operator: operatorName,
        paidAmounts: paymentData.paidAmounts,
        receiptNumber: receiptNumber,
        date: new Date().toISOString(),
        isExistingStudent: !!existingStudent,
        totalPaid: newPaymentTotal
      })

      // NE PAS appeler setAlreadyPaidAmounts ici
      // NE PAS appeler loadExistingPayments ici
      
      setStep('preview')
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde des données: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => window.print()

  const handleNewPayment = () => {
    setStep('form')
    if (!existingStudent) {
      setStudentData({ name: '', schoolYear: getDefaultSchoolYear() })
      setPaidAmounts({ inscription: '', fraisAnnexes: '', pension_0: '', pension_1: '', pension_2: '' }) // MODIFICATION
      setExistingPayments([])
      setAlreadyPaidAmounts({ inscription: 0, fraisAnnexes: 0, pension_0: 0, pension_1: 0, pension_2: 0 }) // MODIFICATION
    } else {
      setPaidAmounts({ inscription: '', fraisAnnexes: '', pension_0: '', pension_1: '', pension_2: '' }) // MODIFICATION
      // Recharger les paiements existants pour mettre à jour l'interface
      loadExistingPayments(existingStudent.id)
    }
    setReceiptData(null)
  }

  const handleContinue = () => onPaymentComplete()

  const { totalDue, totalPaid, remaining, existingTotal, newPaymentTotal, isFullyPaid } = calculateTotals()

    useEffect(() =>{
    window.scrollTo(0,0)
  },[])


  if (!fees) {
    return (
      <div className="payment-intake-error">
        <div className="error-content">
          <h1 className="error-title">Données non disponibles</h1>
          <button onClick={() => navigateTo('palier')} className="error-button">
            Retour au choix de classe
          </button>
        </div>
      </div>
    )
  }

  if (step === 'preview' && receiptData) {
    console.log('🔄 PaymentIntake - alreadyPaidAmounts pour ReceiptPreview:', alreadyPaidAmounts);
    console.log('🔄 PaymentIntake - receiptData.paidAmounts:', receiptData.paidAmounts);
    
    return (
      <div className="payment-intake-preview">
        <div className="preview-container">
          <ReceiptPreview
            receiptData={receiptData}
            studentData={{
              name: studentData.name,
              class: className,
              schoolYear: studentData.schoolYear,
              matricule: existingStudent?.matricule || generateMatricule(new Date().getFullYear(), 1)
            }}
            fees={fees}
            onPrint={handlePrint}
            existingPayments={existingPayments}
            alreadyPaidAmounts={alreadyPaidAmounts}
          />
          <div className="preview-actions">
            <button onClick={handleNewPayment} className="preview-button secondary">
              {existingStudent ? 'Nouveau paiement pour cet élève' : 'Nouveau paiement'}
            </button>
            <button onClick={handleContinue} className="preview-button primary">
              Voir la liste des élèves
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-intake-container">
      {existingStudent && (
        <div className="existing-student-banner">
          <div className="banner-content">
            <span className="banner-icon">↻</span>
            <span className="banner-text">
              Continuation de paiement pour {existingStudent.name} 
              {existingStudent.matricule && ` (${existingStudent.matricule})`}
            </span>
          </div>
          <div className="banner-info">
            Montants déjà payés: 
            Inscription: {formatCurrency(alreadyPaidAmounts.inscription)} | 
            Frais annexes: {formatCurrency(alreadyPaidAmounts.fraisAnnexes)} | // AJOUT
            Tranche 1: {formatCurrency(alreadyPaidAmounts.pension_0)} | 
            Tranche 2: {formatCurrency(alreadyPaidAmounts.pension_1)} | 
            Tranche 3: {formatCurrency(alreadyPaidAmounts.pension_2)}
          </div>
        </div>
      )}

      <div className="student-info-card">
        <h2 className="section-title">
          {existingStudent ? 'Informations de l\'élève' : 'Nouvel élève'}
        </h2>
        <div className="student-form-grid">
          <div className="form-field">
            <label htmlFor="name" className="field-label">Nom complet de l'élève *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={studentData.name}
              onChange={handleStudentDataChange}
              className="field-input"
              placeholder="Saisir le nom complet"
              required
              disabled={!!existingStudent}
            />
          </div>
          <div className="form-field">
            <label htmlFor="schoolYear" className="field-label">Année scolaire</label>
            <input
              type="text"
              id="schoolYear"
              name="schoolYear"
              value={studentData.schoolYear}
              onChange={handleStudentDataChange}
              className="field-input"
              placeholder={getDefaultSchoolYear()}
            />
          </div>
          <div className="form-field">
            <label className="field-label">Section</label>
            <input
              type="text"
              value={section === 'im1' ? 'Francophone' : 'Anglophone'}
              className="field-input readonly"
              readOnly
            />
          </div>
          <div className="form-field">
            <label className="field-label">Classe</label>
            <input
              type="text"
              value={className}
              className="field-input readonly"
              readOnly
            />
          </div>
        </div>
      </div>

      <FeeTable
        fees={fees}
        paidAmounts={paidAmounts}
        onAmountChange={handleAmountChange}
        isFieldDisabled={isFieldAlreadyPaid}
        existingPayments={existingPayments}
        alreadyPaidAmounts={alreadyPaidAmounts}
      />

      <div className="actions-footer">
        <button onClick={() => navigateTo('palier')} className="footer-button secondary">Retour</button>
        <div className="totals-container">
          <div className="totals-display">
            <p className="total-item">Total à payer: {formatCurrency(totalDue)}</p>
            <p className="total-item">Déjà payé: {formatCurrency(existingTotal)}</p>
            <p className="total-item">Nouveau paiement: {formatCurrency(newPaymentTotal)}</p>
            <p className="total-item">Total payé: {formatCurrency(totalPaid)}</p>
            <div className={`payment-status ${isFullyPaid ? 'fully-paid' : 'not-paid'}`}>
              {isFullyPaid ? (
                <div className="fully-paid-badge">✅ SCOLARITÉ ENTIÈREMENT SOLDÉE</div>
              ) : (
                <p className="total-remaining">Reste à payer: {formatCurrency(remaining)}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={loading || !studentData.name.trim() || newPaymentTotal <= 0}
            className="footer-button primary"
          >
            {loading ? 'Sauvegarde...' : 
             existingStudent ? 'Ajouter ce paiement' : 'Sauvegarder et continuer'}
          </button>
        </div>
      </div>
    </div>
  )
}