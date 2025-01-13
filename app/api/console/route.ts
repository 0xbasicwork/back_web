import { NextResponse } from 'next/server';

const API_URL = 'http://45.76.10.9:3000/api/console';
const HISTORY_URL = 'http://45.76.10.9:3000/api/console/history';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const type = searchParams.get('type') || 'all';

    console.log('Fetching from:', API_URL, 'and', HISTORY_URL);

    // Fetch both current and historical logs
    const [currentRes, historyRes] = await Promise.all([
      fetch(API_URL, {
        headers: { 'Accept': 'application/json' }
      }),
      fetch(HISTORY_URL, {
        headers: { 'Accept': 'application/json' }
      })
    ]);

    console.log('Response status:', {
      current: currentRes.status,
      history: historyRes.status
    });

    if (!currentRes.ok || !historyRes.ok) {
      throw new Error('Failed to fetch logs');
    }

    const currentText = await currentRes.text();
    const historyText = await historyRes.text();

    console.log('Current text length:', currentText.length);
    console.log('History text length:', historyText.length);
    console.log('Sample current:', currentText.substring(0, 200));
    console.log('Sample history:', historyText.substring(0, 200));

    // Combine and process all logs
    const allLines = [...historyText.split('\n'), ...currentText.split('\n')]
      .filter(line => line.trim());

    console.log('Total lines after combining:', allLines.length);

    const logs = allLines.map(line => {
      const [datePart, ...messageParts] = line.split('UTC:');
      const message = messageParts.join('UTC:').trim();
      const timestamp = datePart ? new Date(datePart.trim() + ' UTC').toISOString() : new Date().toISOString();
      
      const type = line.includes('✓') ? 'success' : 
                  line.includes('→') ? 'info' :
                  line.includes('•') ? 'system' :
                  line.includes('❌') ? 'error' : 'log';

      return {
        timestamp,
        type,
        message: message || line
      };
    });

    console.log('Processed logs count:', logs.length);
    console.log('Sample processed log:', logs[0]);

    // Sort by timestamp
    logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json({
      logs,
      total: logs.length,
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