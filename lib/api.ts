const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://45.76.10.9:3000/api';

export interface IndexData {
  timestamp: string;
  score: number;
  label: string;
  components: {
    market: number;
    sentiment: number;
    onChain: number;
  };
}

export interface HistoryData {
  score: number;
  timestamp: string;
}

export interface TrendData {
  trend: 'increasing' | 'decreasing' | 'stable' | 'insufficient_data';
}

export async function getLatestIndex(): Promise<IndexData> {
  // Mock data for now - replace with actual API call
  return {
    timestamp: new Date().toISOString(),
    score: 65,
    label: 'Neutral',
    components: {
      market: 70,
      sentiment: 60,
      onChain: 65
    }
  };
}

export async function getIndexHistory(days = 30): Promise<HistoryData[]> {
  const res = await fetch(`${API_BASE_URL}/history?days=${days}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch history data');
  }
  
  return res.json();
}

export async function getIndexTrend(): Promise<TrendData> {
  const res = await fetch(`${API_BASE_URL}/trend`, {
    next: { revalidate: 300 } // Revalidate every 5 minutes
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch trend data');
  }
  
  return res.json();
} 