import { NextResponse } from 'next/server';

const API_URL = 'http://45.76.10.9:3000/api/console';
const HISTORY_URL = 'http://45.76.10.9:3000/api/console/history';

function parseDate(dateStr: string): Date {
  try {
    // Convert DD/MM/YYYY to MM/DD/YYYY for proper parsing
    const [day, month, year, ...time] = dateStr.split(/[\/,\s]/);
    return new Date(`${month}/${day}/${year} ${time.join(' ')} UTC`);
  } catch (error) {
    console.error('Date parsing error:', error);
    return new Date();
  }
}

function parseLogLine(line: string) {
  // Skip empty lines and headers
  if (!line.trim() || line.startsWith('Over & Back Index') || line.startsWith('Last Updated:')) {
    return null;
  }

  // Handle section headers with emojis
  if (line.includes('🚀') || line.includes('📊') || line.includes('🐦') || line.includes('⛓️')) {
    return {
      timestamp: new Date().toISOString(),
      type: 'system',
      message: line.trim()
    };
  }

  // Parse timestamped lines
  const timestampMatch = line.match(/(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}) UTC:/);
  if (timestampMatch) {
    try {
      const timestamp = parseDate(timestampMatch[1]).toISOString();
      const message = line.split('UTC:')[1].trim();

      // Determine log type based on content
      let type = 'info';
      if (message.includes('✓')) type = 'success';
      else if (message.includes('•')) type = 'system';
      else if (message.includes('→')) type = 'info';
      else if (message.includes('❌')) type = 'error';

      return {
        timestamp,
        type,
        message
      };
    } catch (error) {
      console.error('Error parsing line:', line, error);
      return null;
    }
  }

  // Handle indented/formatted lines
  if (line.startsWith('   ')) {
    return {
      timestamp: new Date().toISOString(),
      type: 'info',
      message: line.trim()
    };
  }

  return null;
}

export async function GET() {
  try {
    console.log('Fetching console logs...');
    const [currentRes, historyRes] = await Promise.all([
      fetch(API_URL),
      fetch(HISTORY_URL)
    ]);

    if (!currentRes.ok || !historyRes.ok) {
      throw new Error('Failed to fetch logs');
    }

    const currentText = await currentRes.text();
    const historyText = await historyRes.text();

    // Process both current and historical logs
    const logs = [...currentText.split('\n'), ...historyText.split('\n')]
      .map(parseLogLine)
      .filter((log): log is NonNullable<typeof log> => log !== null)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    console.log('Processed logs count:', logs.length);
    if (logs.length > 0) {
      console.log('Sample log:', logs[0]);
    }

    return NextResponse.json({
      logs,
      total: logs.length,
      limit: 100,
      type: 'all'
    });
  } catch (error) {
    console.error('Console API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch logs' },
      { status: 500 }
    );
  }
} 