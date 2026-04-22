import styles from './Toast.module.css';

export default function Toast({ type = 'info', message = '' }) {
  return <div className={`${styles.toast} ${styles[type]}`} role="status" aria-live="polite">{message}</div>;
}
