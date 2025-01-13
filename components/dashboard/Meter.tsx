'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MeterProps {
  value: number;
  label: string;
  className?: string;
}

export function Meter({ value, label, className }: MeterProps) {
  const pointerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pointerRef.current) return;
    
    const rotation = (value / 100) * 180 - 90;
    pointerRef.current.style.transform = `rotate(${rotation}deg)`;
  }, [value]);

  return (
    <div className={cn('relative aspect-[2/1] w-full max-w-[400px]', className)}>
      {/* Gauge Background */}
      <div className="absolute inset-0 h-full w-full overflow-hidden rounded-t-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" />
      
      {/* Gauge Face */}
      <div className="absolute bottom-0 left-1/2 h-[95%] w-[95%] -translate-x-1/2 rounded-t-full bg-white">
        {/* Tick Marks */}
        <div className="absolute bottom-0 left-1/2 h-full w-0.5 -translate-x-1/2 transform-origin-bottom" />
        {Array.from({ length: 11 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 left-1/2 h-full w-0.5 -translate-x-1/2 transform-origin-bottom bg-gray-300"
            style={{ transform: `rotate(${(i * 18) - 90}deg)` }}
          />
        ))}
        
        {/* Pointer */}
        <div
          ref={pointerRef}
          className="absolute bottom-0 left-1/2 h-[85%] w-1 -translate-x-1/2 transform-origin-bottom bg-black transition-transform duration-500"
        />
        
        {/* Center Point */}
        <div className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-black" />
      </div>
      
      {/* Score Display */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
        <div className="text-4xl font-bold">{Math.round(value)}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
      </div>
    </div>
  );
} 