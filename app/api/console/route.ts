import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    // During build time, return empty logs
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      return new NextResponse('', {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

    try {
      const [currentRes, historyRes] = await Promise.all([
        fetch('http://45.76.10.9:3000/api/console', {
          headers: { 'Accept': 'text/plain' }
        }),
        fetch('http://45.76.10.9:3000/api/console/history', {
          headers: { 'Accept': 'text/plain' }
        })
      ]);

      if (!currentRes.ok || !historyRes.ok) {
        throw new Error('Failed to fetch logs');
      }

      const currentText = await currentRes.text();
      const historyText = await historyRes.text();

      // Combine the logs
      const combinedLogs = `${historyText}\n${currentText}`;
      
      return new NextResponse(combinedLogs, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      // Return empty string instead of error during runtime
      return new NextResponse('', {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

  } catch (error) {
    console.error('Console API Error:', error);
    // Return empty string instead of error
    return new NextResponse('', { 
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
} 