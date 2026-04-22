import { Link } from 'react-router-dom';
import styles from './LearnPage.module.css';

const systems = [
  {
    name: 'Ayurveda',
    focus: 'Constitutional balance through diet, herbs, and daily rhythms.',
  },
  {
    name: 'Yoga',
    focus: 'Breath, movement, and mental discipline for integrated wellbeing.',
  },
  {
    name: 'Unani',
    focus: 'Humoral balance and temperament-based therapeutic logic.',
  },
  {
    name: 'Siddha',
    focus: 'Elemental and mineral-herbal approaches from southern traditions.',
  },
  {
    name: 'Homeopathy',
    focus: 'Highly diluted remedies selected by symptom similarity.',
  },
];

const concepts = [
  {
    title: 'Dosha',
    detail: 'Vata, Pitta, and Kapha represent functional tendencies and guide personalization.',
  },
  {
    title: 'Rasa',
    detail: 'Primary taste profile that hints at immediate and longer-term effects.',
  },
  {
    title: 'Virya',
    detail: 'Heating or cooling potency influencing metabolic response.',
  },
  {
    title: 'Vipaka',
    detail: 'Post-digestive effect that shapes downstream tissue response.',
  },
];

export default function LearnPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>AYUSH knowledge base</p>
        <h1>AYUSH Learning Center</h1>
        <p>
          Build a practical foundation before exploring remedies and plant profiles. This hub summarizes the core frameworks
          used across the platform.
        </p>
      </section>

      <section className={styles.grid}>
        <article className={styles.panel}>
          <h2>Five AYUSH Systems</h2>
          <div className={styles.list}>
            {systems.map((item) => (
              <div key={item.name} className={styles.row}>
                <h3>{item.name}</h3>
                <p>{item.focus}</p>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <h2>Key Concepts</h2>
          <div className={styles.list}>
            {concepts.map((item) => (
              <div key={item.title} className={styles.row}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.cta}>
        <h2>Continue with hands-on exploration</h2>
        <div className={styles.actions}>
          <Link to="/plants" className={styles.primaryLink}>Browse medicinal plants</Link>
          <Link to="/quiz" className={styles.secondaryLink}>Take the dosha quiz</Link>
        </div>
      </section>
    </main>
  );
}
