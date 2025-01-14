import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    // During build time, return empty array
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      return NextResponse.json([]);
    }

    const response = await fetch('http://45.76.10.9:3000/api/history', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy API Error:', error);
    return new NextResponse(null, { status: 500 });
  }
} 