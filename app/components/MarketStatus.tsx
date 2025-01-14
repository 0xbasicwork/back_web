'use client';

import { useEffect, useState } from 'react';

interface IndexData {
  index: number;
  market_data: number;
  social_sentiment: number;
  onchain_activity: number;
}

export function getMarketStatus(score: number): string {
  if (score < 20) {
    return 'IT\'S SO OVER';
  } else if (score < 40) {
    return 'IT IS WHAT IT IS';
  } else if (score < 60) {
    return 'WE VIBING';
  } else if (score < 80) {
    return 'WE\'RE SO BACK';
  } else {
    return 'LET\'S FKN GOOO!';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'IT\'S SO OVER':
      return 'text-red-500';
    case 'IT IS WHAT IT IS':
      return 'text-orange-500';
    case 'WE VIBING':
      return 'text-yellow-500';
    case 'WE\'RE SO BACK':
      return 'text-green-500';
    case 'LET\'S FKN GOOO!':
      return 'text-emerald-500';
    default:
      return 'text-gray-500';
  }
}

function getLEDColorForIndex(index: number): string {
  if (index < 20) return 'bg-red-500';
  if (index < 40) return 'bg-orange-500';
  if (index < 60) return 'bg-yellow-500';
  if (index < 80) return 'bg-green-500';
  return 'bg-emerald-500';
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
        const marketStatus = getMarketStatus(data.index);
        
        setStatus(marketStatus);
        setError(null);
      } catch (error: unknown) {
        console.error('Error fetching index:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
        setStatus('WE VIBING'); // Updated default fallback
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
        className={`font-bold animate-[breathing_3s_ease-in-out_infinite] ${getStatusColor(status)} whitespace-nowrap`}
      >
        {status}
      </span>
    </div>
  );
} 