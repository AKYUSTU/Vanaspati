import styles from './ProgressRing.module.css';

export default function ProgressRing({ value = 0, total = 100 }) {
  const radius = 52;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const pct = Math.max(0, Math.min(1, value / total));
  const strokeDashoffset = circumference - pct * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} role="img" aria-label="Progress ring">
      <circle stroke="#e8dec8" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
      <circle
        className={styles.progress}
        stroke="#4a8c5c"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className={styles.label}>
        {value}/{total}
      </text>
    </svg>
  );
}
