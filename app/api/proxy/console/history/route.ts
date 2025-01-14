import { NextResponse } from 'next/server';

const API_BASE_URL = 'http://45.76.10.9:3000';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/console/history`, {
      headers: {
        'Accept': 'text/plain',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

  } catch (error) {
    console.error('Console history proxy error:', error);
    return new NextResponse('No historical logs available', { status: 200 });
  }
} 