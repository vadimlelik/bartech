import styles from './PageLoader.module.css';

/** Локальный индикатор загрузки (не использовать как app/loading.js). */
export default function PageLoader() {
  return (
    <div className={styles.loadingContainer} role="status" aria-live="polite">
      <div className={styles.loader} />
      <p className={styles.loadingText}>Загрузка...</p>
    </div>
  );
}
