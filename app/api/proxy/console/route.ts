import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const response = await fetch('http://45.76.10.9:3000/api/console', {
      headers: { 'Accept': 'text/plain' }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch logs');
    }

    const text = await response.text();
    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (error) {
    console.error('Console Proxy Error:', error);
    return new NextResponse('Error fetching logs', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
} 