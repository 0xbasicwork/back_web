'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface LogEntry {
  timestamp: string | null;  // null for section headers
  type: 'success' | 'info' | 'system' | 'error' | 'log' | 'header' | 'subheader';
  message: string;
}

function parseLogLine(line: string): LogEntry | null {
  try {
    // Check if it's a section header (starts with emoji)
    if (line.match(/^[^\s]/)) {  // Starts with non-whitespace (emoji)
      return {
        timestamp: null,
        type: 'header',
        message: line
      };
    }

    // Check if it's a subheader (indented without timestamp)
    if (line.startsWith('   ') && !line.includes('UTC:')) {
      return {
        timestamp: null,
        type: 'subheader',
        message: line.trim()
      };
    }

    // Regular log line with timestamp - keep original timestamp
    const match = line.match(/(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2} UTC): (.+)/);
    if (match) {
      const [, timestamp, messageWithIcon] = match;
      
      let type: LogEntry['type'] = 'log';
      if (messageWithIcon.includes('✓')) type = 'success';
      else if (messageWithIcon.includes('→')) type = 'info';
      else if (messageWithIcon.includes('•')) type = 'system';
      else if (messageWithIcon.includes('❌')) type = 'error';

      return {
        timestamp,  // Keep original timestamp string
        type,
        message: messageWithIcon.trim()
      };
    }

    return null;
  } catch (err) {
    console.error('Failed to parse log line:', line, err);
    return null;
  }
}

export function ConsoleOutput() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'log' | 'error'>('all');
  const consoleRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const lastScrollPosition = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (consoleRef.current && autoScroll) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [autoScroll]);

  const handleScroll = () => {
    if (consoleRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = consoleRef.current;
      lastScrollPosition.current = scrollTop;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  };

  const fetchLogs = useCallback(async () => {
    try {
      console.log('Fetching console logs...');
      
      const [currentRes, historyRes] = await Promise.all([
        fetch('/api/proxy/console', {
          cache: 'no-store',
          headers: { 'Accept': 'text/plain' },
        }),
        fetch('/api/proxy/console/history', {
          cache: 'no-store',
          headers: { 'Accept': 'text/plain' },
        })
      ]);

      const currentText = await currentRes.text();
      const historyText = await historyRes.text();

      // Parse logs from text format
      const currentLogs = currentText.split('\n')
        .filter(line => line.trim())
        .map(parseLogLine)
        .filter(Boolean) as LogEntry[];

      const historyLogs = historyText.split('\n')
        .filter(line => line.trim())
        .map(parseLogLine)
        .filter(Boolean) as LogEntry[];

      // Combine all logs first to maintain header order
      const combinedLogs = [...historyLogs, ...currentLogs];

      // Sort only the timestamped logs while preserving header positions
      const allLogs = combinedLogs.map(log => {
        // If this is a timestamped log, find the nearest sorted position
        if (log.timestamp) {
          const timestamp = new Date(log.timestamp).getTime();
          const nearestTimestampedLog = combinedLogs
            .filter((l): l is LogEntry & { timestamp: string } => {
              return l.timestamp !== null && new Date(l.timestamp).getTime() <= timestamp;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
          
          return nearestTimestampedLog || log;
        }
        // Return headers and subheaders as-is
        return log;
      });

      // Filter logs if needed
      const filteredLogs = filter === 'all' 
        ? allLogs 
        : allLogs.filter(log => log.type === filter);

      setLogs(filteredLogs);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  }, [filter, scrollToBottom]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchLogs();
      const interval = setInterval(fetchLogs, 10000);
      return () => clearInterval(interval);
    }
  }, [fetchLogs]);

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'info': return 'text-blue-400';
      case 'system': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'header': return 'text-purple-400 font-bold text-lg';
      case 'subheader': return 'text-gray-400 italic';
      default: return 'text-gray-100';
    }
  };

  return (
    <div className="mt-4 md:mt-8 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 md:mb-4 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg md:text-xl font-bold">Data Collection Progress</h2>
          <div className="px-2 py-0.5 bg-gray-200 rounded text-xs md:text-sm">
            {logs.length} entries
          </div>
          <button
            onClick={() => {
              setAutoScroll(true);
              scrollToBottom();
            }}
            className={`px-2 py-0.5 rounded text-xs ${
              autoScroll ? 'bg-green-200' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {autoScroll ? 'Auto-scrolling' : 'Click to auto-scroll'}
          </button>
        </div>
        <div className="flex gap-2">
          <select 
            className="px-2 py-1 border rounded text-xs md:text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">All Logs</option>
            <option value="log">Logs Only</option>
            <option value="error">Errors Only</option>
          </select>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-xs md:text-sm"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      <div 
        ref={consoleRef}
        onScroll={handleScroll}
        className={`bg-gray-900 text-gray-100 rounded-lg p-2 md:p-4 overflow-auto transition-all ${
          isExpanded ? 'h-[400px] md:h-[500px]' : 'h-[150px] md:h-[200px]'
        }`}
      >
        {logs.map((log, index) => (
          <div 
            key={index}
            className={`mb-1 font-mono text-xs md:text-sm ${getLogColor(log.type)}`}
          >
            {log.timestamp && (
              <span className="text-gray-500">
                {log.timestamp}:{' '}
              </span>
            )}
            <span className="whitespace-pre-wrap break-words">{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500 text-center mt-4 text-sm">
            No logs available
          </div>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-1 flex justify-between">
        <span>Auto-refreshing every 10 seconds</span>
        <span>{autoScroll ? 'Auto-scrolling enabled' : 'Auto-scrolling disabled'}</span>
      </div>
    </div>
  );
} 