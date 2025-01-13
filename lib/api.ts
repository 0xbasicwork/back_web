// Always use HTTP since the API doesn't have SSL
const API_BASE_URL = 'http://45.76.10.9:3000';

export interface IndexData {
  score: number;
  trend: 'up' | 'down' | 'neutral';
  components: {
    market: number;
    sentiment: number;
    onChain: number;
  };
  lastUpdated: string;
}

export async function getIndexData(): Promise<IndexData> {
  try {
    console.log('Fetching from:', API_BASE_URL);
    // Use proxy endpoint instead of direct API call
    const res = await fetch('/api/proxy/index', {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'text/html',
      },
      cache: 'no-store'
    });

    console.log('Response status:', res.status);
    const html = await res.text();
    console.log('Response HTML:', html.substring(0, 200) + '...'); // First 200 chars

    // Updated regex patterns to match the actual HTML structure
    const scoreMatch = html.match(/<div class="score">(\d+)<\/div>/);
    const marketMatch = html.match(/Market Data[\s\S]*?value">(\d+)%<\/span>/);
    const sentimentMatch = html.match(/Social Sentiment[\s\S]*?value">(\d+)%<\/span>/);
    const onChainMatch = html.match(/On-chain Activity[\s\S]*?value">(\d+)%<\/span>/);

    const score = parseFloat(scoreMatch?.[1] || '50');
    const market = parseFloat(marketMatch?.[1] || '50');
    const sentiment = parseFloat(sentimentMatch?.[1] || '50');
    const onChain = parseFloat(onChainMatch?.[1] || '50');

    return {
      score,
      trend: 'neutral',
      components: {
        market,
        sentiment,
        onChain
      },
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Try these potential endpoints
export async function getAvailableEndpoints() {
  const endpoints = [
    '/api/index',          // Main index data
    '/api/history',        // Historical data
    '/api/tokens',         // Token list
    '/api/metrics',        // Detailed metrics
    '/api/volume',         // Volume data
    '/api/sentiment',      // Detailed sentiment
    '/api/onchain'         // Detailed on-chain data
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`);
      console.log(`${endpoint}: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(data);
      }
    } catch (error) {
      console.log(`${endpoint}: Not available`);
    }
  }
} 