'use client';

import { useState, useEffect } from 'react';

export function OverBackIndex() {
  const [indexData, setIndexData] = useState<{ html: string; css: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIndexData() {
      console.log('Fetching from proxy');
      try {
        const res = await fetch('/api/proxy');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setIndexData(data);
      } catch (err: unknown) {
        console.error('Fetch error:', err);
        setError(`Error loading index data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    fetchIndexData();
  }, []);

  if (error) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-yellow-400">OVER/BACK Index</h1>
        <p className="mt-4 text-red-500">{error}</p>
      </div>
    );
  }

  if (!indexData) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-yellow-400">OVER/BACK Index</h1>
        <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-400 border-solid"></div>
        <p className="mt-2 text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: indexData.css }} />
      <div dangerouslySetInnerHTML={{ __html: indexData.html }} />
    </>
  );
} 