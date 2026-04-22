export default function PlantPin({ x, y, label }) {
  return (
    <g>
      <circle cx={x} cy={y} r="10" fill="#c9922a" opacity="0.9" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="8" fill="#fff">{label}</text>
    </g>
  );
}
