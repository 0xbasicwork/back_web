'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://45.76.10.9:3000';

export function OverBackIndex() {
  const [indexData, setIndexData] = useState<{ html: string; css: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIndexData() {
      try {
        const res = await fetch(API_URL, {
          headers: {
            'Accept': 'text/html',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const html = await res.text();

        const cssLink = html.match(/<link rel="stylesheet" href="(\/css\/styles\.css)">/)?.[1];
        if (cssLink) {
          const cssRes = await fetch(`${API_URL}${cssLink}`, {
            headers: {
              'Accept': 'text/css',
              'Cache-Control': 'no-cache'
            }
          });
          const css = await cssRes.text();
          setIndexData({ html, css });
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error loading index data. Please try again later.');
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