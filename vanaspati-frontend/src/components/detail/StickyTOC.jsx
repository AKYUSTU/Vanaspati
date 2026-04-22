import styles from './StickyTOC.module.css';

function toLabel(value) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function StickyTOC({ sections = [] }) {
  return (
    <aside className={styles.toc}>
      <h3>On This Page</h3>
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`}>{section.label || toLabel(section.id)}</a>
      ))}
    </aside>
  );
}
