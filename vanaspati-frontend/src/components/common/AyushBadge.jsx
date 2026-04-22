export default function AyushBadge({ system = 'AYURVEDA', icon = 'AY' }) {
  const klass = `badge badge-${system.toLowerCase()}`;
  return <span className={klass}>{icon} {system}</span>;
}
