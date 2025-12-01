'use client';

import React, { useState } from 'react';
import styles from './CreditCardsModal.module.css';
import CreditDetailsModal from './CreditDetailsModal';

const creditOffers = [
  {
    id: 'sberbank',
    bank: 'Сбер Банк',
    title: "Кредит 'Комбо'",
    terms: [13, 18, 24, 36, 48, 60],
    minAmount: 100,
    maxAmount: 20000,
    rate: '19,10',
    headerGradient: 'linear-gradient(135deg, #6BA3D8 0%, #9B7EDE 100%)',
    buttonGradient: 'linear-gradient(135deg, #6BA3D8 0%, #9B7EDE 100%)',
    borderColor: '#6BA3D8',
    rateColor: '#6BA3D8',
  },
  {
    id: 'dabrabyt',
    bank: 'Банк Дабрабыт',
    title: "Кредит 'Комбо товары РБ'",
    terms: [13, 18, 24, 36],
    minAmount: 50,
    maxAmount: 15000,
    rate: '16,25',
    headerGradient: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    buttonGradient: 'linear-gradient(135deg, #FF6B35 0%, #D84315 100%)',
    borderColor: '#FF6B35',
    rateColor: '#FF6B35',
  },
  {
    id: 'neobank',
    bank: 'Нео Банк Азия',
    title: "Кредит 'Комбо'",
    terms: [12, 18, 24, 30, 36, 48, 60],
    minAmount: 100,
    maxAmount: 17000,
    rate: '19,10',
    headerGradient: 'linear-gradient(135deg, #6BA3D8 0%, #9B7EDE 100%)',
    buttonGradient: 'linear-gradient(135deg, #6BA3D8 0%, #9B7EDE 100%)',
    borderColor: '#6BA3D8',
    rateColor: '#6BA3D8',
  },
  {
    id: 'belveb',
    bank: 'БелВэб',
    title: "Кредит 'Комбо'",
    terms: [12, 18, 24],
    minAmount: 50,
    maxAmount: 7000,
    rate: '19,10',
    headerGradient: 'linear-gradient(135deg, #6BA3D8 0%, #9B7EDE 100%)',
    buttonGradient: 'linear-gradient(135deg, #6BA3D8 0%, #9B7EDE 100%)',
    borderColor: '#6BA3D8',
    rateColor: '#6BA3D8',
  },
];

export default function CreditCardsModal({ isOpen, onClose }) {
  const [selectedBank, setSelectedBank] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleDetailsClick = (bankId) => {
    setSelectedBank(bankId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedBank(null);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
          <div className={styles.content}>
            <h2 className={styles.title}>Кредитные предложения</h2>
            <div className={styles.grid}>
              {creditOffers.map((offer) => (
                <div key={offer.id} className={styles.card} style={{ borderColor: offer.borderColor }}>
                  <div
                    className={styles.header}
                    style={{ background: offer.headerGradient }}
                  >
                    <h3 className={styles.cardTitle}>{offer.title}</h3>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.bankName}>{offer.bank}</div>
                    <div className={styles.details}>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Срок:</span>
                        <span className={styles.value}>
                          {offer.terms.join(', ')} месяцев
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Мин. сумма:</span>
                        <span className={styles.value}>{offer.minAmount} BYN</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.label}>Макс. сумма:</span>
                        <span className={styles.value}>{offer.maxAmount.toLocaleString('ru-RU')} BYN</span>
                      </div>
                    </div>
                    <div className={styles.rate} style={{ color: offer.rateColor }}>
                      {offer.rate} % годовых
                    </div>
                    <button
                      className={styles.detailsButton}
                      style={{ background: offer.buttonGradient }}
                      onClick={() => handleDetailsClick(offer.id)}
                    >
                      Подробнее
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CreditDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        bankId={selectedBank}
      />
    </>
  );
}

