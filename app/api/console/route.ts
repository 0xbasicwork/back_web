import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    // During build time, return empty logs
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      return new NextResponse('No logs available during build', {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

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
    
    // Return as plain text
    return new NextResponse(combinedLogs, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (error) {
    console.error('Console API Error:', error);
    return new NextResponse('Error fetching logs', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
} 