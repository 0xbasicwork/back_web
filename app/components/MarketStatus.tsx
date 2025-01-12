'use client';

import { useEffect, useState } from 'react';

interface IndexData {
  index: number;
  market_data: number;
  social_sentiment: number;
  onchain_activity: number;
}

function getColorForIndex(index: number): string {
  if (index <= 10) return 'text-red-500';
  if (index <= 25) return 'text-red-400';
  if (index <= 35) return 'text-orange-500';
  if (index <= 45) return 'text-yellow-500';
  if (index <= 55) return 'text-yellow-400';
  if (index <= 65) return 'text-lime-400';
  if (index <= 75) return 'text-lime-500';
  if (index <= 90) return 'text-green-400';
  return 'text-green-500';
}

function getLEDColorForIndex(index: number): string {
  if (index <= 10) return 'bg-red-500';
  if (index <= 25) return 'bg-red-400';
  if (index <= 35) return 'bg-orange-500';
  if (index <= 45) return 'bg-yellow-500';
  if (index <= 55) return 'bg-yellow-400';
  if (index <= 65) return 'bg-lime-400';
  if (index <= 75) return 'bg-lime-500';
  if (index <= 90) return 'bg-green-400';
  return 'bg-green-500';
}

export default function MarketStatus() {
  const [status, setStatus] = useState('Loading...');
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(48);

  useEffect(() => {
    const fetchIndex = async () => {
      try {
        const response = await fetch('/api/index', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store'
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response not ok:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: IndexData = await response.json();
        console.log('Index data:', data);
        setIndex(data.index);
        
        // Interpret the index value
        let marketStatus;
        if (data.index <= 10) {
          marketStatus = 'It\'s so over.';
        } else if (data.index <= 25) {
          marketStatus = 'It\'s over.';
        } else if (data.index <= 35) {
          marketStatus = 'Fuck it, we ball.';
        } else if (data.index <= 50) {
          marketStatus = 'It is what it is.';
        } else if (data.index <= 65) {
          marketStatus = 'We vibing.';
        } else if (data.index <= 75) {
          marketStatus = 'We\'re back.';
        } else if (data.index <= 90) {
          marketStatus = 'We are so back.';
        } else {
          marketStatus = 'LET\'S FUCKING GOOO!';
        }
        
        setStatus(marketStatus);
        setError(null);
      } catch (error: unknown) {
        console.error('Error fetching index:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
        setStatus('We are so back.'); // Default fallback
      }
    };

    fetchIndex();
    const interval = setInterval(fetchIndex, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    console.error('Rendering error state:', error);
  }

  return (
    <div className="flex items-center gap-2 font-[var(--font-roboto-mono)] bg-black text-white px-3 py-2 rounded-full text-sm md:text-base">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${getLEDColorForIndex(index)} animate-pulse`} />
        <span className="text-gray-300 whitespace-nowrap">MARKET STATUS:</span>
      </div>
      <span 
        className={`font-bold animate-[breathing_3s_ease-in-out_infinite] ${getColorForIndex(index)} whitespace-nowrap`}
      >
        {status}
      </span>
    </div>
  );
} 