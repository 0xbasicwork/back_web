'use client';

import { useState, useEffect } from 'react';
import { getIndexData, type IndexData, getHistoricalData, type HistoricalDataPoint } from '@/lib/api';
import { DrunkenFont } from '../DrunkenFont';
import { Meter } from './Meter';
import { getMarketStatus } from '@/app/components/MarketStatus';
import { IndexHistory } from './IndexHistory';
import { ConsoleOutput } from './ConsoleOutput';
import { format } from 'date-fns';
import Image from 'next/image';

export function OverBackIndex() {
  const [data, setData] = useState<IndexData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [headerText, setHeaderText] = useState('Hey Solana...');
  const [copyFeedback, setCopyFeedback] = useState(false);

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

  useEffect(() => {
    const sequence = async () => {
      // Start with "Hey Solana..."
      await new Promise(resolve => setTimeout(resolve, 3000));
      // Show "Is it Over?"
      setHeaderText('Is it Over?');
      await new Promise(resolve => setTimeout(resolve, 4000));
      // Show "Are We $BACK?"
      setHeaderText('Are We $BACK?');
      // Wait 30 seconds before restarting
      await new Promise(resolve => setTimeout(resolve, 30000));
      // Reset to "Hey Solana..."
      setHeaderText('Hey Solana...');
    };
    
    sequence();
    
    // Total time: 3000 + 4000 + 30000 = 37000ms
    const interval = setInterval(sequence, 37000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const titleContent = (
    <div className='sticky top-0 bg-white z-10 pb-2 md:pb-4 border-b border-gray-200'>
      <h1 className={`${DrunkenFont.className} text-center px-2 md:px-4`}>
        <div className='text-4xl md:text-8xl text-black'>
          CRUNCHING NUMBERS...
        </div>
      </h1>
    </div>
  );

  if (error) {
    return (
      <div className='text-center max-w-7xl mx-auto'>
        {titleContent}
        <p className='mt-4 text-red-500 px-4'>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='text-center max-w-7xl mx-auto'>
        {titleContent}
        <div className='mt-4 flex flex-col items-center'>
          <Image 
            src="/images/typing-cat.gif"
            alt="Loading..."
            width={200}
            height={150}
            className="rounded-lg"
          />
          <p className='mt-2 text-gray-400 text-sm md:text-base'>Please wait meow...</p>
        </div>
      </div>
    );
  }

  const formattedDate = (dateString: string) => {
    try {
      return `${format(new Date(dateString), 'dd/MM/yyyy HH:mm')} UTC`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100'>
      <div className='sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-200 shadow-md'>
        <h1 className={`${DrunkenFont.className} text-center px-2 md:px-4 py-4`}>
          <div 
            key={headerText}
            className='text-4xl md:text-8xl text-black opacity-0 animate-fadeIn'
          >
            {headerText}
          </div>
        </h1>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 hover:shadow-xl transition-shadow duration-300'>
          <div className='flex flex-col md:flex-row gap-6 mb-4 md:mb-8'>
            <div className='md:w-1/2 transition-all duration-500 ease-in-out hover:scale-105'>
              <Meter 
                value={data.score} 
                size={window.innerWidth < 768 ? 300 : 400}
                className='mx-auto w-full max-w-[300px] md:max-w-[400px]' 
              />
            </div>

            <div className='md:w-1/2 space-y-6 flex flex-col justify-center'>
              <div 
                className='font-mono font-bold text-3xl md:text-[48px] text-center md:text-left uppercase tracking-tight'
                style={{ color: getColorForStatus(data.score) }}
              >
                <span className='text-black block md:inline'>STATUS:</span>
                {getMarketStatus(data.score)}
              </div>

              <div className='bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-3 font-mono hover:shadow-lg transition-shadow duration-300'>
                <h3 className='text-sm font-bold text-gray-600 mb-3 font-mono'>Previous Values:</h3>
                
                <div className='space-y-2'>
                  {[
                    { label: 'Yesterday', status: data.previousStatus, score: data.previousScore },
                    { label: '1 week ago', status: 'COMING SOON', score: null, disabled: true },
                    { label: '1 month ago', status: 'COMING SOON', score: null, disabled: true },
                    { label: '1 year ago', status: 'EVENTUALLY', score: null, disabled: true }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className={`flex justify-between items-center border-b border-gray-200 pb-2 
                        ${item.disabled ? 'opacity-50' : 'hover:bg-gray-50 transition-colors duration-200'}
                        ${index === 0 ? 'animate-fadeIn' : ''}`}
                    >
                      <div className='flex items-center gap-2'>
                        <span className='text-gray-600 text-sm font-mono'>{item.label}</span>
                        <span className='font-bold text-sm font-mono'>{item.status || 'NO DATA YET'}</span>
                      </div>
                      <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm font-mono text-black
                        ${item.disabled ? 'bg-gray-100 text-gray-600' : 
                        'bg-gray-200 hover:scale-110 transition-transform duration-200 border-2'}`}
                        style={!item.disabled && item.score ? { 
                          borderColor: getColorForStatus(item.score),
                          boxShadow: `0 0 0 1px ${getColorForStatus(item.score)}20`
                        } : undefined}>
                        {item.score || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600 text-sm md:text-base'>Market</span>
              <span className='font-bold text-sm md:text-base'>{data.components.market}%</span>
            </div>
            <div className='h-2 md:h-3 bg-gray-300 rounded-full'>
              <div 
                className='h-full rounded-full transition-all'
                style={{ 
                  width: `${data.components.market}%`,
                  backgroundColor: getColorForStatus(data.components.market)
                }}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600 text-sm md:text-base'>Sentiment</span>
              <span className='font-bold text-sm md:text-base'>{data.components.sentiment}%</span>
            </div>
            <div className='h-2 md:h-3 bg-gray-300 rounded-full'>
              <div 
                className='h-full rounded-full transition-all'
                style={{ 
                  width: `${data.components.sentiment}%`,
                  backgroundColor: getColorForStatus(data.components.sentiment)
                }}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600 text-sm md:text-base'>On-Chain</span>
              <span className='font-bold text-sm md:text-base'>{data.components.onChain}%</span>
            </div>
            <div className='h-2 md:h-3 bg-gray-300 rounded-full'>
              <div 
                className='h-full rounded-full transition-all'
                style={{ 
                  width: `${data.components.onChain}%`,
                  backgroundColor: getColorForStatus(data.components.onChain)
                }}
              />
            </div>
          </div>
        </div>

        <div className='mt-6 md:mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-200'>
          <h2 className='text-lg md:text-xl font-bold mb-3 md:mb-4 text-center'>30 Day History</h2>
          <IndexHistory data={historicalData} />
        </div>

        <div className='mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200'>
          <ConsoleOutput />
        </div>

        <div className='text-center text-xs md:text-sm text-gray-600 mt-6 md:mt-8 font-mono'>
          Last Updated: {formattedDate(data.lastUpdated)}
        </div>

        <div className='mt-6 text-center'>
          <div className='inline-flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex-wrap justify-center'
               onClick={() => copyToClipboard('AUiXW4YH5TLNFBgVayFBRvgWTz2ApeeM1Br7FCoyrugj')}>
            <span className='font-mono text-sm text-gray-600 mr-1'>$BACK:</span>
            <span className='font-mono text-xs sm:text-sm break-all max-w-[200px] sm:max-w-none'>AUiXW4YH5TLNFBgVayFBRvgWTz2ApeeM1Br7FCoyrugj</span>
            {copyFeedback ? (
              <span className='text-green-500 text-sm ml-1'>✓ Copied!</span>
            ) : (
              <svg className='w-4 h-4 text-gray-500 ml-1 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2' />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getColorForStatus(index: number): string {
  if (index < 20) return '#EF4444';  // red-500
  if (index < 40) return '#F97316';  // orange-500
  if (index < 60) return '#EAB308';  // yellow-500
  if (index < 80) return '#22C55E';  // green-500
  return '#10B981';                  // emerald-500
} 