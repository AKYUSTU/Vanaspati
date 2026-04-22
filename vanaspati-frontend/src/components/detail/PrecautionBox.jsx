import styles from './PrecautionBox.module.css';

export default function PrecautionBox({ text }) {
  return (
    <div className={styles.box}>
      <strong className={styles.heading}>Warning</strong>
      <p className={styles.copy}>{text || 'Consult a certified AYUSH practitioner before use.'}</p>
    </div>
  );
}
