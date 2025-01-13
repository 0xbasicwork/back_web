'use client';

interface IndexMeterProps {
  value: number;
}

export function IndexMeter({ value }: IndexMeterProps) {
  // Calculate percentage for the circle
  const circumference = 2 * Math.PI * 120; // radius: 120
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* SVG Circle */}
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 280 280">
        {/* Background circle */}
        <circle
          cx="140"
          cy="140"
          r="120"
          className="stroke-gray-200"
          strokeWidth="12"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="140"
          cy="140"
          r="120"
          className="stroke-blue-500 transition-all duration-1000"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset
          }}
        />
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-bold font-mono">{value}</div>
        <div className="text-gray-500 mt-2 font-mono">Index Score</div>
      </div>
    </div>
  );
} 