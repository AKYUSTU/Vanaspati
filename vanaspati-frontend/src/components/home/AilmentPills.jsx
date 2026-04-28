import { useNavigate } from 'react-router-dom';
import styles from './AilmentPills.module.css';

const ailments = [
  { label: '🌡️ Fever', id: 1 },
  { label: '🌀 Digestion', id: 2 },
  { label: '🛡️ Immunity', id: 3 },
  { label: '✨ Skin Care', id: 4 },
  { label: '🧘 Stress & Anxiety', id: 5 },
  { label: '🩸 Diabetes', id: 6 },
  { label: '🦴 Joint Pain', id: 7 },
  { label: '💨 Respiratory', id: 8 },
  { label: '😴 Better Sleep', id: 9 },
  { label: '💇 Hair Growth', id: 10 },
  { label: '👁️ Eye Care', id: 11 },
  { label: '🧠 Memory & Focus', id: 12 },
];

export default function AilmentPills() {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <h2>What Are You Looking For Today?</h2>
      <p className={styles.subtitle}>Browse by health concern to find relevant plants and remedies.</p>
      <div className={styles.wrap}>
        {ailments.map((item) => (
          <button
            key={item.label}
            type="button"
            className={styles.pill}
            onClick={() => navigate(`/ailments/${item.id}`)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
