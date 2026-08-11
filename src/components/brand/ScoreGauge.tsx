import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 200 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const strokeWidth = 18;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const fillPercent = animatedScore / 100;
  const dashOffset = circumference * (1 - fillPercent);

  const getColor = (s: number) => {
    if (s >= 85) return "var(--color-success)";
    if (s >= 70) return "var(--color-teal)";
    if (s >= 50) return "var(--color-warning)";
    return "var(--color-danger)";
  };

  const color = getColor(animatedScore);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-light)"
          strokeWidth={strokeWidth}
        />
        {/* Score arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-6xl md:text-7xl font-bold tabular-nums"
          style={{ fontFamily: "var(--font-serif)", color: "var(--color-navy)", lineHeight: 1 }}
        >
          {animatedScore}
        </span>
        <span
          className="text-sm font-medium tracking-wide mt-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Overall Score
        </span>
      </div>
    </motion.div>
  );
}
