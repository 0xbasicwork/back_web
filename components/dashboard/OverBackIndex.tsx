'use client';

import { useState, useEffect } from 'react';
import { getIndexData, type IndexData, getHistoricalData, type HistoricalData } from '@/lib/api';
import { DrunkenFont } from '../DrunkenFont';
import { IndexMeter } from './IndexMeter';
import { getMarketStatus } from '@/app/components/MarketStatus';
import { IndexHistory } from './IndexHistory';

export function OverBackIndex() {
  const [data, setData] = useState<IndexData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const indexData = await getIndexData();
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
        const data = await getHistoricalData();
        setHistoricalData(data);
      } catch (err) {
        console.error('Error fetching historical data:', err);
      }
    }

    fetchHistoricalData();
  }, []);

  const titleContent = (
    <h1 className={`${DrunkenFont.className} text-center mb-8`}>
      <div className="text-8xl text-black mb-2">IS IT OVER...</div>
      <div className="text-6xl text-black mb-2">OR</div>
      <div className="text-8xl text-black">ARE WE BACK?</div>
    </h1>
  );

  if (error) {
    return (
      <div className="text-center">
        {titleContent}
        <p className="mt-4 text-red-500">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center">
        {titleContent}
        <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-400 border-solid"></div>
        <p className="mt-2 text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {titleContent}
      
      {/* Main Score with Meter */}
      <div className="text-center mb-8">
        <IndexMeter value={data.score} />
        <div className="font-['Roboto_Mono'] font-bold text-[64px] mt-2 uppercase" 
          style={{ 
            color: getColorForStatus(data.score) 
          }}
        >
          {getMarketStatus(data.score)}
        </div>
      </div>

      {/* Components */}
      <div className="space-y-6 font-mono">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Market</span>
            <span className="font-bold">{data.components.market}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${data.components.market}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Sentiment</span>
            <span className="font-bold">{data.components.sentiment}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${data.components.sentiment}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">On-Chain</span>
            <span className="font-bold">{data.components.onChain}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${data.components.onChain}%` }}
            />
          </div>
        </div>
      </div>

      {/* Historical Graph */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-center">30 Day History</h2>
        <IndexHistory data={historicalData} />
      </div>

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500 mt-8 font-mono">
        Last Updated: {data.lastUpdated.replace('UTC', '').trim()}
      </div>
    </div>
  );
}

function getColorForStatus(index: number): string {
  if (index <= 10) return '#EF4444';  // red-500
  if (index <= 25) return '#F87171';  // red-400
  if (index <= 35) return '#F97316';  // orange-500
  if (index <= 45) return '#EAB308';  // yellow-500
  if (index <= 55) return '#FACC15';  // yellow-400
  if (index <= 65) return '#A3E635';  // lime-400
  if (index <= 75) return '#84CC16';  // lime-500
  if (index <= 90) return '#4ADE80';  // green-400
  return '#22C55E';                   // green-500
} 