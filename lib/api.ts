import { format } from 'date-fns';

// Always use HTTP since the API doesn't have SSL
const API_BASE_URL = 'http://45.76.10.9:3000';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Empty string for client-side
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
};

export interface IndexData {
  score: number;
  label: string;
  trend: 'up' | 'down' | 'neutral';
  components: {
    market: number;
    sentiment: number;
    onChain: number;
  };
  lastUpdated: string;
}

const fetchWithFallback = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    // During build time, return default data
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      return new Response(JSON.stringify({
        score: 50,
        trend: 'neutral',
        components: {
          market: 50,
          sentiment: 50,
          onChain: 50
        },
        lastUpdated: new Date().toISOString()
      }));
    }
    throw error;
  }
};

export async function getIndexData(): Promise<IndexData> {
  try {
    console.log('Fetching from:', API_BASE_URL);
    
    const baseUrl = getBaseUrl();
    const proxyUrl = `${baseUrl}/api/proxy`;

    const res = await fetchWithFallback(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    console.log('Response status:', res.status);
    const data = await res.json();
    console.log('Response data:', data);

    return {
      score: data.score,
      label: data.label,
      trend: 'neutral',
      components: {
        market: Math.round(data.components.market),
        sentiment: Math.round(data.components.sentiment),
        onChain: Math.round(data.components.onChain)
      },
      lastUpdated: data.timestamp
    };
  } catch (error) {
    console.error('API Error:', error);
    // Return default data during build
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      return {
        score: 50,
        label: 'Loading...',
        trend: 'neutral',
        components: {
          market: 50,
          sentiment: 50,
          onChain: 50
        },
        lastUpdated: new Date().toISOString()
      };
    }
    throw error;
  }
}

// Try these potential endpoints
// export async function getAvailableEndpoints() {
//   const endpoints = [
//     '/api/index',          // Main index data
//     '/api/history',        // Historical data
//     '/api/tokens',         // Token list
//     '/api/metrics',        // Detailed metrics
//     '/api/volume',         // Volume data
//     '/api/sentiment',      // Detailed sentiment
//     '/api/onchain'         // Detailed on-chain data
//   ];
//
//   for (const endpoint of endpoints) {
//     try {
//       const res = await fetch(`${API_BASE_URL}${endpoint}`);
//       console.log(`${endpoint}: ${res.status}`);
//       if (res.ok) {
//         const data = await res.json();
//         console.log(data);
//       }
//     } catch (error) {
//       console.log(`${endpoint}: Not available`);
//     }
//   }
// }

export interface HistoricalData {
  timestamp: string;
  value: number;
}

// Add proper type for the mapped data
interface HistoryDataPoint {
  timestamp?: string;
  date?: string;
  score?: number;
  value?: number;
}

export async function getHistoricalData(): Promise<HistoricalData[]> {
  try {
    console.log('Fetching historical data via proxy');
    
    const baseUrl = getBaseUrl();
    const proxyUrl = `${baseUrl}/api/proxy/history`;

    const res = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error('History API response not OK:', res.status, res.statusText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const rawData = await res.json();
    console.log('Raw historical data:', rawData);

    if (!Array.isArray(rawData)) {
      console.error('Historical data is not an array:', rawData);
      return [];
    }

    const mappedData = rawData
      .map((item: HistoryDataPoint) => ({
        timestamp: item.timestamp || item.date || '',  // Provide empty string as fallback
        value: item.score || item.value || 0
      }))
      .filter(item => item.timestamp !== ''); // Filter out items with empty timestamps

    console.log('Mapped historical data:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Historical API Error:', error);
    // Return empty array during build
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      return [];
    }
    return [];
  }
}

export const formatDateResponse = (date: string | Date) => {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
};

export interface TrendData {
  trend: 'up' | 'down' | 'neutral';
  strength: number;
  timestamp: string;
}

export async function getTrendData(): Promise<TrendData> {
  try {
    const baseUrl = getBaseUrl();
    const proxyUrl = `${baseUrl}/api/proxy/trend`;

    const res = await fetchWithFallback(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Trend API Error:', error);
    // Return default data during build
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      return {
        trend: 'neutral',
        strength: 50,
        timestamp: new Date().toISOString()
      };
    }
    throw error;
  }
} 