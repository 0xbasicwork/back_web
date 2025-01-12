'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [indexData, setIndexData] = useState<{ html: string; css: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIndexData() {
      try {
        const res = await fetch('http://45.76.10.9:3000');
        const html = await res.text();

        const cssLink = html.match(/<link rel="stylesheet" href="(\/css\/styles\.css)">/)?.[1];
        if (cssLink) {
          const cssRes = await fetch(`http://45.76.10.9:3000${cssLink}`);
          const css = await cssRes.text();
          setIndexData({ html, css });
        }
      } catch (err) {
        setError('Error loading index data. Please try again later.');
      }
    }

    fetchIndexData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-yellow-400">OVER/BACK Index</h1>
          <p className="mt-4 text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!indexData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-yellow-400">OVER/BACK Index</h1>
          <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-400 border-solid"></div>
          <p className="mt-2 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add inline styles dynamically */}
      <style dangerouslySetInnerHTML={{ __html: indexData.css }} />
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-yellow-400">OVER/BACK Index</h1>
            <nav>
              <a href="/" className="text-gray-400 hover:text-yellow-400 mx-2">Home</a>
              <a href="/about" className="text-gray-400 hover:text-yellow-400 mx-2">About</a>
              <a href="/contact" className="text-gray-400 hover:text-yellow-400 mx-2">Contact</a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">
          {/* Render the HTML dynamically */}
          <div dangerouslySetInnerHTML={{ __html: indexData.html }} />
        </main>
        <footer className="bg-gray-800 p-4 text-center text-gray-400">
          <p>© 2025 Over/Back Index. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
