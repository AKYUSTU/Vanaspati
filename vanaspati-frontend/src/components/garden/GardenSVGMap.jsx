// Restore clean garden map — no region dots (those belong on the plant detail map)
function fallbackPath(index) {
  const col = index % 3;
  const row = Math.floor(index / 3);
  const x = 80 + col * 360;
  const y = 100 + row * 260;
  const w = 280;
  const h = 180;
  return `M${x},${y} L${x + w},${y} L${x + w},${y + h} L${x},${y + h} Z`;
}

export default function GardenSVGMap({ zones = [], activeZone, onZoneClick }) {
  return (
    <svg viewBox="0 0 1200 900" width="100%" role="img" aria-label="Garden map">
      <rect x="0" y="0" width="1200" height="900" fill="#eaf3e1" />

      {/* Zone shapes */}
      {zones.map((zone, index) => (
        <path
          key={zone.id}
          d={zone.svgPathData || fallbackPath(index)}
          fill={zone.colorHex || '#4A8C5C'}
          fillOpacity={activeZone?.id === zone.id ? 0.35 : 0.2}
          stroke={activeZone?.id === zone.id ? '#C9922A' : zone.colorHex || '#4A8C5C'}
          strokeWidth="3"
          onClick={() => onZoneClick(zone)}
          cursor="pointer"
        />
      ))}

      {/* Zone labels */}
      {zones.map((zone, index) => (
        <text
          key={`label-${zone.id}`}
          x={zone.svgCx ?? (220 + (index % 3) * 360)}
          y={zone.svgCy ?? (170 + Math.floor(index / 3) * 260)}
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#1f2a21"
          pointerEvents="none"
        >
          {zone.iconEmoji || 'Z'}
        </text>
      ))}
    </svg>
  );
}
