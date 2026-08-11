import React from 'react';
import { motion } from 'framer-motion';

interface RadarChartProps {
  data: { label: string; score: number }[];
  size?: number;
}

export function RadarChart({ data, size = 300 }: RadarChartProps) {
  const numAxis = data.length;
  if (numAxis < 3) return null;

  const center = size / 2;
  const radius = center * 0.70;
  const angleStep = (Math.PI * 2) / numAxis;

  const dataPoints = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const value = d.score / 100;
    const x = center + radius * value * Math.cos(angle);
    const y = center + radius * value * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const levels = 5;
  const gridRings = Array.from({ length: levels }).map((_, levelIndex) => {
    const levelRadius = radius * ((levelIndex + 1) / levels);
    const points = Array.from({ length: numAxis }).map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + levelRadius * Math.cos(angle);
      const y = center + levelRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    return points;
  });

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {gridRings.map((points, i) => (
          <polygon
            key={`grid-${i}`}
            points={points}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray={i === levels - 1 ? 'none' : '4 4'}
          />
        ))}

        {Array.from({ length: numAxis }).map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="var(--color-border)"
              strokeWidth="1"
            />
          );
        })}

        <motion.polygon
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          style={{ originX: '50%', originY: '50%' }}
          points={dataPoints}
          fill="rgba(43, 182, 168, 0.15)"
          stroke="var(--color-teal)"
          strokeWidth="2"
        />

        {data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const value = d.score / 100;
          const x = center + radius * value * Math.cos(angle);
          const y = center + radius * value * Math.sin(angle);
          return (
            <motion.circle
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1 }}
              key={`point-${i}`}
              cx={x}
              cy={y}
              r="4"
              fill="white"
              stroke="var(--color-teal)"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 35;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);

        return (
          <div
            key={`label-${i}`}
            className="absolute flex flex-col items-center justify-center pointer-events-none"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
              width: '120px'
            }}
          >
            <span className="text-[11px] font-semibold text-[var(--color-text-secondary)] whitespace-nowrap text-center tracking-wider">
              {d.label}
            </span>
            <span className="text-sm font-bold text-[var(--color-navy)] tabular-nums mt-0.5">
              {d.score === 0 && d.label.toLowerCase().includes('social') ? '--' : d.score}
            </span>
          </div>
        );
      })}
    </div>
  );
}
