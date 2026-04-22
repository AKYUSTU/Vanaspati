import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <h3>🌿 Vanaspati</h3>
          <p>India's digital sanctuary of healing plants.<br/>Rooted in 5,000 years of AYUSH wisdom.</p>
        </div>
        <div className={styles.links}>
          <h4>Explore</h4>
          <Link to="/plants">Plants</Link>
          <Link to="/remedies">Remedies</Link>
          <Link to="/ailments">Ailments</Link>
          <Link to="/garden">Garden</Link>
        </div>
        <div className={styles.links}>
          <h4>Learn</h4>
          <Link to="/learn">AYUSH Guide</Link>
          <Link to="/quiz">Dosha Quiz</Link>
          <Link to="/seasonal-calendar">Seasonal Calendar</Link>
          <Link to="/compare">Compare Plants</Link>
        </div>
        <div className={styles.links}>
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {year} Vanaspati — Virtual Herbal Garden. For educational purposes only.</p>
      </div>
    </footer>
  );
}
