'use client';

import { useState, useEffect } from 'react';
import { getIndexData, type IndexData, getHistoricalData, type HistoricalDataPoint } from '@/lib/api';
import { DrunkenFont } from '../DrunkenFont';
import { Meter } from './Meter';
import { getMarketStatus } from '@/app/components/MarketStatus';
import { IndexHistory } from './IndexHistory';
import { ConsoleOutput } from './ConsoleOutput';
import { format } from 'date-fns';

export function OverBackIndex() {
  const [data, setData] = useState<IndexData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const indexData = await getIndexData();
        console.log('Latest API data:', indexData);
        setData(indexData);
      } catch (err: unknown) {
        console.error('Fetch error:', err);
        setError(`Error loading index data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    fetchData();

    // Refresh data every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchHistoricalData() {
      try {
        console.log('Fetching historical data...');
        const data = await getHistoricalData();
        console.log('Raw historical data:', data);
        
        // Validate data structure
        if (Array.isArray(data)) {
          console.log('Number of historical records:', data.length);
          console.log('Sample record:', data[0]);
        } else {
          console.error('Historical data is not an array:', typeof data);
        }
        
        setHistoricalData(data);
      } catch (err) {
        console.error('Error fetching historical data:', err);
      }
    }

    fetchHistoricalData();
  }, []);

  const titleContent = (
    <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
      <h1 className={`${DrunkenFont.className} text-center px-4`}>
        <div className="text-4xl md:text-6xl text-black">
          IS IT OVER... OR ARE WE BACK?
        </div>
      </h1>
    </div>
  );

  if (error) {
    return (
      <div className="text-center max-w-7xl mx-auto">
        {titleContent}
        <p className="mt-4 text-red-500 px-4">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center max-w-7xl mx-auto">
        {titleContent}
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-4 border-yellow-400 border-solid"></div>
        </div>
        <p className="mt-2 text-gray-400 text-sm md:text-base">Loading...</p>
      </div>
    );
  }

  const formattedDate = (dateString: string) => {
    try {
      return `${format(new Date(dateString), 'dd/MM/yyyy HH:mm')} UTC`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString; // fallback to original string if parsing fails
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto">
      {titleContent}
      
      <div className="p-4 md:p-6">
        {/* Main Score with Meter */}
        <div className="text-center mb-6 md:mb-8">
          <Meter value={data.score} />
          <div className="font-['Roboto_Mono'] font-bold text-4xl md:text-[64px] mt-2 uppercase" 
            style={{ color: getColorForStatus(data.score) }}
          >
            {getMarketStatus(data.score)}
          </div>
        </div>

        {/* Components */}
        <div className="space-y-4 md:space-y-6 font-mono">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Market</span>
              <span className="font-bold text-sm md:text-base">{data.components.market}%</span>
            </div>
            <div className="h-2 md:h-3 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${data.components.market}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">Sentiment</span>
              <span className="font-bold text-sm md:text-base">{data.components.sentiment}%</span>
            </div>
            <div className="h-2 md:h-3 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${data.components.sentiment}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm md:text-base">On-Chain</span>
              <span className="font-bold text-sm md:text-base">{data.components.onChain}%</span>
            </div>
            <div className="h-2 md:h-3 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${data.components.onChain}%` }}
              />
            </div>
          </div>
        </div>

        {/* Historical Graph */}
        <div className="mt-6 md:mt-8">
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-center">30 Day History</h2>
          <IndexHistory data={historicalData} />
        </div>

        {/* Console Output */}
        <ConsoleOutput />

        {/* Last Updated */}
        <div className="text-center text-xs md:text-sm text-gray-500 mt-6 md:mt-8 font-mono">
          Last Updated: {formattedDate(data.lastUpdated)}
        </div>
      </div>
    </div>
  );
}

function getColorForStatus(index: number): string {
  if (index < 20) return '#EF4444';  // red-500 - IT'S SO OVER
  if (index < 40) return '#F97316';  // orange-500 - IT IS WHAT IT IS
  if (index < 60) return '#EAB308';  // yellow-500 - WE VIBING
  if (index < 80) return '#22C55E';  // green-500 - WE'RE SO BACK
  return '#10B981';                  // emerald-500 - LET'S FKN GOOO!
} 