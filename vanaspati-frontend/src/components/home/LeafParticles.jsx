import styles from './LeafParticles.module.css';

const leaves = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  size: 16 + Math.floor(Math.random() * 32),
  delay: `${Math.random() * 5}s`,
  duration: `${8 + Math.random() * 12}s`,
}));

export default function LeafParticles() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          className={styles.leaf}
          style={{
            '--leaf-left': leaf.left,
            '--leaf-size': `${leaf.size}px`,
            '--leaf-delay': leaf.delay,
            '--leaf-duration': leaf.duration,
          }}
        >
          leaf
        </span>
      ))}
    </div>
  );
}
