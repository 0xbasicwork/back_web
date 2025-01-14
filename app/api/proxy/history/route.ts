import { NextResponse } from 'next/server';

const API_BASE_URL = 'http://45.76.10.9:3000';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    console.log('Attempting to fetch from:', `${API_BASE_URL}/api/history`);
    
    const response = await fetch(`${API_BASE_URL}/api/history`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`API responded with status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully fetched data:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Historical proxy error:', error);
    // Return empty array instead of error response
    return NextResponse.json([]);
  }
}
