import styles from './Modal.module.css';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <header>
          <h3>{title}</h3>
          <button onClick={onClose} aria-label="Close">x</button>
        </header>
        <div>{children}</div>
      </div>
    </div>
  );
}
