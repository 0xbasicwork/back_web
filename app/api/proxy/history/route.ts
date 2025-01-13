import { NextResponse } from 'next/server';

const API_URL = 'http://45.76.10.9:3000/api/history';

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const rawData = await res.json();
    
    const data = rawData.map((entry: any) => ({
      timestamp: entry.timestamp,
      value: entry.score || 50
    }));

    console.log('Processed historical data:', data);

    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data' }, 
      { status: 500 }
    );
  }
} 