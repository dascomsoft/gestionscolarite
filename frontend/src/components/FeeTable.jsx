




import React from 'react'
import { formatCurrency } from '../lib/format'
import '../Styles/FeeTable.css'

export function FeeTable({ fees, paidAmounts, onAmountChange, alreadyPaidAmounts, isFieldDisabled }) {
  if (!fees) return null;

  // CORRECTION: Calculer les montants combinés (anciens + nouveaux)
  const calculateCombinedAmounts = () => {
    const combined = {
      inscription: (alreadyPaidAmounts?.inscription || 0) + (parseFloat(paidAmounts.inscription) || 0),
      pension_0: (alreadyPaidAmounts?.pension_0 || 0) + (parseFloat(paidAmounts.pension_0) || 0),
      pension_1: (alreadyPaidAmounts?.pension_1 || 0) + (parseFloat(paidAmounts.pension_1) || 0),
      pension_2: (alreadyPaidAmounts?.pension_2 || 0) + (parseFloat(paidAmounts.pension_2) || 0)
    };
    return combined;
  };

  const combinedAmounts = calculateCombinedAmounts();

  // Calculer les totaux basés sur les anciens paiements + nouveaux paiements
  const totalDue = fees.inscription + fees.pension.reduce((sum, item) => sum + item.amount, 0);
  
  // CORRECTION: Utiliser les montants combinés pour les totaux
  const totalPaid = Object.values(combinedAmounts).reduce((sum, amount) => sum + amount, 0);
  const remaining = totalDue - totalPaid;

  // Debug
  console.log('💰 Anciens paiements:', alreadyPaidAmounts);
  console.log('💰 Nouveaux paiements:', paidAmounts);
  console.log('💰 Montants combinés:', combinedAmounts);
  console.log('🧮 Total dû:', totalDue);
  console.log('🧮 Total payé:', totalPaid);
  console.log('🧮 Reste:', remaining);

  return (
    <div className="fee-table-container">
      <div className="fee-table-header">
        <h3 className="fee-table-title">État actuel de paiement</h3>
      </div>
      
      <div className="table-wrapper">
        <table className="fee-table">
          <thead className="table-header">
            <tr className="table-header-row">
              <th className="table-head tariff-head">Tarifications</th>
              <th className="table-head amount-head">Montants</th>
              <th className="table-head paid-head">Déjà payés</th>
              <th className="table-head remaining-head">Reste</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {/* Ligne Inscription */}
            <tr className="table-row">
              <td className="table-cell tariff-cell">Inscription</td>
              <td className="table-cell amount-cell">{formatCurrency(fees.inscription)}</td>
              <td className="table-cell paid-cell">
                {formatCurrency(combinedAmounts.inscription)}
              </td>
              <td className="table-cell remaining-cell">
                {formatCurrency(Math.max(0, fees.inscription - combinedAmounts.inscription))}
              </td>
            </tr>
            
            {/* Lignes des tranches de pension */}
            {fees.pension.map((item, index) => {
              const pensionKey = `pension_${index}`;
              const alreadyPaid = combinedAmounts[pensionKey] || 0;
              const remainingAmount = Math.max(0, item.amount - alreadyPaid);
              const isDisabled = isFieldDisabled && isFieldDisabled(pensionKey);
              
              return (
                <tr key={index} className="table-row">
                  <td className="table-cell tariff-cell">{item.tranche}</td>
                  <td className="table-cell amount-cell">{formatCurrency(item.amount)}</td>
                  <td className="table-cell paid-cell">
                    {formatCurrency(alreadyPaid)}
                  </td>
                  <td className="table-cell remaining-cell">
                    {formatCurrency(remainingAmount)}
                  </td>
                </tr>
              );
            })}
            
            {/* Ligne des totaux */}
            <tr className="table-total-row">
              <td className="table-cell total-cell">Total</td>
              <td className="table-cell total-amount-cell">{formatCurrency(totalDue)}</td>
              <td className="table-cell total-amount-cell">{formatCurrency(totalPaid)}</td>
              <td className="table-cell total-amount-cell">{formatCurrency(remaining)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section de saisie des nouveaux paiements */}
      <div className="new-payment-section">
        <h4 className="new-payment-title">Nouveau paiement</h4>
        <div className="payment-inputs-grid">
          {/* Input pour l'inscription */}
          <div className="payment-input-group">
            <label className="payment-label">Inscription</label>
            <input
              type="number"
              value={paidAmounts.inscription || ''}
              onChange={(e) => onAmountChange('inscription', e.target.value)}
              className="payment-input"
              placeholder="0"
              min="0"
              max={fees.inscription - (alreadyPaidAmounts?.inscription || 0)}
              disabled={isFieldDisabled && isFieldDisabled('inscription')}
            />
            <span className="payment-max">
              Max: {formatCurrency(fees.inscription - (alreadyPaidAmounts?.inscription || 0))}
            </span>
          </div>
          
          {/* Inputs pour les tranches de pension */}
          {fees.pension.map((item, index) => {
            const pensionKey = `pension_${index}`;
            const alreadyPaid = alreadyPaidAmounts?.[pensionKey] || 0;
            const maxAmount = item.amount - alreadyPaid;
            const isDisabled = isFieldDisabled && isFieldDisabled(pensionKey);
            
            return (
              <div key={index} className="payment-input-group">
                <label className="payment-label">{item.tranche}</label>
                <input
                  type="number"
                  value={paidAmounts[pensionKey] || ''}
                  onChange={(e) => onAmountChange(pensionKey, e.target.value)}
                  className="payment-input"
                  placeholder="0"
                  min="0"
                  max={maxAmount}
                  disabled={isDisabled}
                />
                <span className="payment-max">
                  Max: {formatCurrency(maxAmount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="fee-table-footer">
        <p className="footer-text">
          Les montants versés ne sont ni remboursables, ni cessibles à des tiers.
        </p>
      </div>
    </div>
  )
}