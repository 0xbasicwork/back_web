'use client';

import { useState, useEffect, useRef } from 'react';

interface LogEntry {
  timestamp: string;
  type: 'log' | 'error';
  message: string;
}

interface ConsoleResponse {
  logs: LogEntry[];
  total: number;
  limit: number;
  type: string;
}

export function ConsoleOutput() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'log' | 'error'>('all');
  const consoleRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (consoleRef.current && autoScroll) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  };

  // Handle manual scroll
  const handleScroll = () => {
    if (consoleRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = consoleRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  };

  useEffect(() => {
    async function fetchLogs() {
      try {
        const params = new URLSearchParams({
          limit: '100',
          ...(filter !== 'all' && { type: filter })
        });
        
        const res = await fetch(`/api/console?${params}`);
        const data: ConsoleResponse = await res.json();
        
        if (data.logs && Array.isArray(data.logs)) {
          setLogs(data.logs);
          // Scroll to bottom after setting new logs
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    }

    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  return (
    <div className="mt-8 font-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Data Collection Logs</h2>
          <div className="px-2 py-0.5 bg-gray-200 rounded text-sm">
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
            className="px-2 py-1 border rounded text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">All Logs</option>
            <option value="log">Logs Only</option>
            <option value="error">Errors Only</option>
          </select>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      <div 
        ref={consoleRef}
        onScroll={handleScroll}
        className={`bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto transition-all ${
          isExpanded ? 'h-[500px]' : 'h-[200px]'
        }`}
      >
        {logs.map((log, index) => (
          <div 
            key={index}
            className={`mb-1 font-mono text-sm ${
              log.type === 'error' ? 'text-red-400' : 'text-green-400'
            }`}
          >
            <span className="text-gray-500">
              {new Date(log.timestamp).toLocaleString()}
            </span>{' '}
            <span className="text-gray-400">[{log.type}]</span>{' '}
            <span className="whitespace-pre-wrap">{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500 text-center mt-4">
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