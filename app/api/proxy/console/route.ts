import { NextResponse } from 'next/server';

const API_URL = 'http://45.76.10.9:3000/api/console';
const HISTORY_URL = 'http://45.76.10.9:3000/api/console/history';

interface LogEntry {
  timestamp: string;
  type: 'success' | 'info' | 'system' | 'error' | 'log';
  message: string;
}

interface ParsedLogEntry extends LogEntry {
  hasExplicitTimestamp: boolean;
  isUpdateLine?: boolean;
}

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

function parseLogLine(line: string, lastKnownTimestamp: string): ParsedLogEntry | null {
  // Check for "Last Updated:" line first to get the base timestamp
  if (line.startsWith('Last Updated:')) {
    const updateMatch = line.match(/Last Updated: (\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}) UTC/);
    if (updateMatch) {
      return {
        timestamp: parseDate(updateMatch[1]).toISOString(),
        type: 'system' as const,
        message: line.trim(),
        hasExplicitTimestamp: true,
        isUpdateLine: true
      };
    }
  }

  // Skip empty lines and headers
  if (!line.trim() || line.startsWith('Over & Back Index')) {
    return null;
  }

  // Parse timestamped lines first
  const timestampMatch = line.match(/(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}) UTC:/);
  if (timestampMatch) {
    try {
      const timestamp = parseDate(timestampMatch[1]).toISOString();
      const message = line.split('UTC:')[1].trim();

      let type: LogEntry['type'] = 'info';
      if (message.includes('✓')) type = 'success';
      else if (message.includes('•')) type = 'system';
      else if (message.includes('→')) type = 'info';
      else if (message.includes('❌')) type = 'error';

      return {
        timestamp,
        type,
        message,
        hasExplicitTimestamp: true
      };
    } catch (error) {
      console.error('Error parsing line:', line, error);
      return null;
    }
  }

  // For non-timestamped lines, use the last known timestamp
  const type: LogEntry['type'] = line.includes('🚀') || line.includes('📊') || 
                                line.includes('🐦') || line.includes('⛓️') ? 'system' : 'info';

  return {
    timestamp: lastKnownTimestamp,
    type,
    message: line.trim(),
    hasExplicitTimestamp: false
  };
}

export async function GET() {
  try {
    const [currentRes, historyRes] = await Promise.all([
      fetch(API_URL),
      fetch(HISTORY_URL)
    ]);

    if (!currentRes.ok || !historyRes.ok) {
      throw new Error('Failed to fetch logs');
    }

    const currentText = await currentRes.text();
    const historyText = await historyRes.text();

    // First find the "Last Updated" timestamp
    const lines = [...historyText.split('\n'), ...currentText.split('\n')];
    const updateLine = lines.find(line => line.startsWith('Last Updated:'));
    let baseTimestamp = new Date().toISOString();
    
    if (updateLine) {
      const updateMatch = updateLine.match(/Last Updated: (\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}) UTC/);
      if (updateMatch) {
        baseTimestamp = parseDate(updateMatch[1]).toISOString();
      }
    }

    // Process logs using the base timestamp
    let lastKnownTimestamp = baseTimestamp;
    const processedLogs: LogEntry[] = [];

    lines
      .map(line => parseLogLine(line, lastKnownTimestamp))
      .filter((log): log is NonNullable<typeof log> => log !== null)
      .forEach(log => {
        if (log.hasExplicitTimestamp) {
          lastKnownTimestamp = log.timestamp;
        }
        // Don't include the "Last Updated" line in the output
        if (!('isUpdateLine' in log)) {
          processedLogs.push({
            timestamp: log.timestamp,
            type: log.type,
            message: log.message
          });
        }
      });

    // Sort by timestamp
    const logs = processedLogs.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

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