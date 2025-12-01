












import React from 'react'
import { formatCurrency, formatDate } from '../lib/format'
import '../Styles/ReceiptPreview.css'

export function ReceiptPreview({ receiptData, studentData, fees, onPrint, existingPayments, alreadyPaidAmounts }) {
  console.log('📄 ReceiptPreview - receiptData:', receiptData)
  console.log('📄 ReceiptPreview - studentData:', studentData)
  console.log('📄 ReceiptPreview - fees:', fees)
  console.log('📄 ReceiptPreview - existingPayments:', existingPayments)
  console.log('📄 ReceiptPreview - alreadyPaidAmounts:', alreadyPaidAmounts)

  if (!receiptData || !studentData) {
    return (
      <div className="receipt-container receipt-error">
        <div className="error-content">
          <p>Données manquantes pour l'impression du reçu</p>
          <p className="error-detail">receiptData: {receiptData ? 'présent' : 'absent'}</p>
          <p className="error-detail">studentData: {studentData ? 'présent' : 'absent'}</p>
        </div>
      </div>
    )
  }

  // CORRECTION : Calculer les montants totaux APRÈS le nouveau paiement
  const calculateTotalAfterPayment = () => {
    const total = {
      inscription: (alreadyPaidAmounts?.inscription || 0) + (receiptData.paidAmounts?.inscription || 0),
      fraisAnnexes: (alreadyPaidAmounts?.fraisAnnexes || 0) + (receiptData.paidAmounts?.fraisAnnexes || 0), // AJOUT
      pension_0: (alreadyPaidAmounts?.pension_0 || 0) + (receiptData.paidAmounts?.pension_0 || 0),
      pension_1: (alreadyPaidAmounts?.pension_1 || 0) + (receiptData.paidAmounts?.pension_1 || 0),
      pension_2: (alreadyPaidAmounts?.pension_2 || 0) + (receiptData.paidAmounts?.pension_2 || 0)
    };
    return total;
  };

  const totalAfterPayment = calculateTotalAfterPayment();

  // Calculer les totaux
  const totalDue = fees.inscription + (fees.fraisAnnexes || 0) + fees.pension.reduce((sum, item) => sum + item.amount, 0); // MODIFICATION
  const totalPaid = Object.values(totalAfterPayment).reduce((sum, amount) => sum + amount, 0);
  const remaining = Math.max(0, totalDue - totalPaid);

  console.log('=== RECEIPT PREVIEW - CALCULS CORRIGÉS ===');
  console.log('💰 Anciens paiements (alreadyPaidAmounts):', alreadyPaidAmounts);
  console.log('💰 Nouveau paiement (receiptData.paidAmounts):', receiptData.paidAmounts);
  console.log('💰 Total après paiement (totalAfterPayment):', totalAfterPayment);
  console.log('🧮 Total dû:', totalDue);
  console.log('🧮 Total payé:', totalPaid);
  console.log('🧮 Reste à payer:', remaining);

  return (
    <div className="receipt-container">
      {/* En-tête administratif */}
      <div className="receipt-header">
        <div className="header-official">
          <h1 className="header-title">RÉPUBLIQUE DU CAMEROUN</h1>
          <p className="header-subtitle">Ministère de l'Education de Base</p>
          <p className="header-detail">Délégation Régionale du Centre • Délégation Départementale du Mfoundi</p>
        </div>
      </div>

      {/* Titre principal */}
      <div className="receipt-title-section">
        <h2 className="school-title">GROUPE SCOLAIRE BILINGUE LA GRACE DE DIEU</h2>
        <h3 className="receipt-title">REÇU DE PAIEMENT N° {receiptData.receiptNumber}</h3>
      </div>

      {/* Informations principales compactes */}
      <div className="receipt-main-info">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Élève:</span>
            <span className="info-value bold">{studentData.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Matricule:</span>
            <span className="info-value">{studentData.matricule}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Classe:</span>
            <span className="info-value">{studentData.class}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date:</span>
            <span className="info-value">{formatDate(receiptData.date)}</span>
          </div>
        </div>
      </div>

      {/* Détails du paiement actuel */}
      <div className="current-payment-section">
        <h4 className="section-title">DÉTAIL DU PAIEMENT ACTUEL</h4>
        <div className="payment-breakdown">
          {receiptData.paidAmounts?.inscription > 0 && (
            <div className="payment-line">
              <span>Inscription:</span>
              <span className="payment-amount">{formatCurrency(receiptData.paidAmounts.inscription)}</span>
            </div>
          )}
          {receiptData.paidAmounts?.fraisAnnexes > 0 && ( // AJOUT
            <div className="payment-line">
              <span>Frais annexes de scolarité:</span>
              <span className="payment-amount">{formatCurrency(receiptData.paidAmounts.fraisAnnexes)}</span>
            </div>
          )}
          {receiptData.paidAmounts?.pension_0 > 0 && (
            <div className="payment-line">
              <span>1ère Tranche Pension:</span>
              <span className="payment-amount">{formatCurrency(receiptData.paidAmounts.pension_0)}</span>
            </div>
          )}
          {receiptData.paidAmounts?.pension_1 > 0 && (
            <div className="payment-line">
              <span>2ème Tranche Pension:</span>
              <span className="payment-amount">{formatCurrency(receiptData.paidAmounts.pension_1)}</span>
            </div>
          )}
          {receiptData.paidAmounts?.pension_2 > 0 && (
            <div className="payment-line">
              <span>3ème Tranche Pension:</span>
              <span className="payment-amount">{formatCurrency(receiptData.paidAmounts.pension_2)}</span>
            </div>
          )}
          <div className="payment-total-line">
            <span>TOTAL PAYÉ:</span>
            <span className="total-amount">{formatCurrency(receiptData.totalPaid)}</span>
          </div>
        </div>
      </div>

      {/* État global des paiements */}
      <div className="payment-status-section">
        <h4 className="section-title">SITUATION FINANCIÈRE GLOBALE</h4>
        <div className="status-table">
          <table className="compact-table">
            <thead>
              <tr>
                <th className="col-desc">DÉSIGNATION</th>
                <th className="col-amount">MONTANT</th>
                <th className="col-paid">DÉJÀ PAYÉ</th>
                <th className="col-restant">RESTANT</th>
              </tr>
            </thead>
            <tbody>
              {/* Inscription */}
              <tr>
                <td className="desc-cell">Frais d'Inscription</td>
                <td className="amount-cell">{formatCurrency(fees.inscription)}</td>
                <td className="paid-cell">{formatCurrency(totalAfterPayment.inscription)}</td>
                <td className="restant-cell">
                  {formatCurrency(Math.max(0, fees.inscription - totalAfterPayment.inscription))}
                </td>
              </tr>

              {/* Frais annexes - AJOUT */}
              <tr>
                <td className="desc-cell">Frais annexes de scolarité</td>
                <td className="amount-cell">{formatCurrency(fees.fraisAnnexes || 0)}</td>
                <td className="paid-cell">{formatCurrency(totalAfterPayment.fraisAnnexes)}</td>
                <td className="restant-cell">
                  {formatCurrency(Math.max(0, (fees.fraisAnnexes || 0) - totalAfterPayment.fraisAnnexes))}
                </td>
              </tr>

              {/* Tranches de pension */}
              {fees.pension.map((item, index) => {
                const pensionKey = `pension_${index}`;
                const alreadyPaid = totalAfterPayment[pensionKey] || 0;
                const remainingAmount = Math.max(0, item.amount - alreadyPaid);

                return (
                  <tr key={index}>
                    <td className="desc-cell">{item.tranche}</td>
                    <td className="amount-cell">{formatCurrency(item.amount)}</td>
                    <td className="paid-cell">{formatCurrency(alreadyPaid)}</td>
                    <td className="restant-cell">{formatCurrency(remainingAmount)}</td>
                  </tr>
                )
              })}

              {/* Totaux */}
              <tr className="total-row">
                <td className="total-desc">TOTAUX</td>
                <td className="total-amount">{formatCurrency(totalDue)}</td>
                <td className="total-paid">{formatCurrency(totalPaid)}</td>
                <td className="total-restant">{formatCurrency(remaining)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="additional-info">
        <div className="operator-info">
          <span>Opérateur: {receiptData.operator || 'Administrateur'}</span>
          <span>Année scolaire: {studentData.schoolYear}</span>
        </div>
        <div className="legal-notice">
          <p className="notice-text">
            Les montants versés ne sont ni remboursables, ni cessibles à des tiers.
          </p>
        </div>
      </div>

      {/* Pied de page */}
      <div className="receipt-footer">
        <div className="footer-contacts">
          <p>Téléphone: (+237) 696-308-503 / WhatsApp: 651989899</p>
          <p>Siège social: YAOUNDÉ - AKOK-NDOE-2 (Quartier Mbouda, face au mini marché)</p>
        </div>
        <div className="footer-legal">
          <p>Arrêté d'ouverture: N° 61/JL/23/A/MINEDUB/SG/DSEPB/SDRA/DR 05 JANVIER 2025</p>
          <p className="print-date">Document généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
      </div>

      {/* Bouton d'impression (visible seulement à l'écran) */}
      <div className="print-actions">
        <button onClick={onPrint} className="print-button">
          🖨️ Imprimer le reçu
        </button>
      </div>
    </div>
  )
}