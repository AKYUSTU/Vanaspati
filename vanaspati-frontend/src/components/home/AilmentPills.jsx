import { useNavigate } from 'react-router-dom';
import styles from './AilmentPills.module.css';

const ailments = [
  { label: '🌡️ Fever', query: 'Fever' },
  { label: '🌀 Digestion', query: 'Digestion' },
  { label: '🛡️ Immunity', query: 'Immunity' },
  { label: '✨ Skin Care', query: 'Skin' },
  { label: '🧘 Stress & Anxiety', query: 'Stress' },
  { label: '🩸 Diabetes', query: 'Diabetes' },
  { label: '🦴 Joint Pain', query: 'Joint' },
  { label: '💨 Respiratory', query: 'Respiratory' },
  { label: '😴 Better Sleep', query: 'Sleep' },
  { label: '💇 Hair Growth', query: 'Hair' },
  { label: '👁️ Eye Care', query: 'Eye' },
  { label: '🧠 Memory & Focus', query: 'Memory' },
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
            onClick={() => navigate('/ailments')}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
