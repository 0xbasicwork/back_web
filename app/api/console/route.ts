import { NextResponse } from 'next/server';

const API_URL = 'http://45.76.10.9:3000/api/console';
const HISTORY_URL = 'http://45.76.10.9:3000/api/history';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const type = searchParams.get('type') || 'all';

    // Fetch both console logs and historical data
    const [consoleRes, historyRes] = await Promise.all([
      fetch(`${API_URL}?limit=${limit}&type=${type}`, {
        headers: { 'Accept': 'application/json' }
      }),
      fetch(HISTORY_URL, {
        headers: { 'Accept': 'application/json' }
      })
    ]);

    if (!consoleRes.ok || !historyRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const consoleData = await consoleRes.json();
    const historyData = await historyRes.json();

    // Convert historical data into log format
    const historyLogs = historyData.map((entry: any) => ({
      timestamp: entry.timestamp,
      type: 'log',
      message: `Historical Index: ${entry.score || entry.value}`
    }));

    // Combine and sort all logs by timestamp
    const allLogs = [...consoleData.logs, ...historyLogs].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return NextResponse.json({
      logs: allLogs,
      total: allLogs.length,
      limit: parseInt(limit),
      type
    });
  } catch (error) {
    console.error('Console API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch logs' },
      { status: 500 }
    );
  }
} 