import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import styles from './Navbar.module.css';

const links = [
  ['Plants', '/plants'],
  ['Garden', '/garden'],
  ['Quiz', '/quiz'],
  ['Remedies', '/remedies'],
  ['Learn', '/learn'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const isLoggedIn = Boolean(window.localStorage.getItem('vanaspati_token'));

  const handleLogout = () => {
    window.localStorage.removeItem('vanaspati_token');
    window.localStorage.removeItem('vanaspati_user');
    window.location.href = '/';
  };

  return (
    <header className={styles.navWrap}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand}>
          <Leaf size={28} strokeWidth={2.5} className={styles.brandIcon} />
          Vanaspati
        </Link>
        <button className={styles.menuBtn} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open} aria-controls="primary-navigation">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div id="primary-navigation" className={`${styles.links} ${open ? styles.open : ''}`}>
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? styles.active : '')}>
              {label}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? styles.active : '')}>Dashboard</NavLink>
              <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : '')}>Login</NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
