'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CooldownModal.module.css';

export default function CooldownModal({
  startTime,
  duration = 120,
  onExpire,
  onClose,
}) {
  const initialRemaining = Math.max(
    duration - Math.floor((Date.now() - startTime) / 1000),
    0
  );
  const [remaining, setRemaining] = useState(initialRemaining);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRemaining = Math.max(
        duration - Math.floor((Date.now() - startTime) / 1000),
        0
      );
      setRemaining(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(interval);
        setVisible(false);
        setTimeout(() => onExpire(), 400); // плавное исчезновение
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onExpire]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          >
            <h3>Вы уже оставляли заявку!</h3>
            <p>Повторно можно отправить через:</p>
            <div className={styles.timer}>
              {Math.floor(remaining / 60)}:
              {(remaining % 60).toString().padStart(2, '0')}
            </div>

            <button className={styles.closeButton} onClick={handleClose}>
              Закрыть
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
