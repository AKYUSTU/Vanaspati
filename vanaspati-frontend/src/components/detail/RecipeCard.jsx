import styles from './RecipeCard.module.css';

export default function RecipeCard({
  title,
  forAilment,
  prepMinutes,
  level,
  steps = [],
}) {
  return (
    <article className={styles.card}>
      <h4 className={styles.title}>{title}</h4>
      <p className={styles.meta}>For: {forAilment} | Prep: {prepMinutes} mins | Level: {level}</p>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={`${title}-${index}`}>{step}</li>
        ))}
      </ol>
    </article>
  );
}
