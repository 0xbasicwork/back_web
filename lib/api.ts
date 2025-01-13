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
    const res = await fetch(API_BASE_URL, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch index data: ${res.status}`);
    }

    const html = await res.text();
    
    // Updated regex patterns to match the actual HTML structure
    const scoreMatch = html.match(/<div class="score">(\d+)<\/div>/);
    const marketMatch = html.match(/Market Data[\s\S]*?value">(\d+)%<\/span>/);
    const sentimentMatch = html.match(/Social Sentiment[\s\S]*?value">(\d+)%<\/span>/);
    const onChainMatch = html.match(/On-chain Activity[\s\S]*?value">(\d+)%<\/span>/);

    const score = parseFloat(scoreMatch?.[1] || '0');
    const market = parseFloat(marketMatch?.[1] || '0');
    const sentiment = parseFloat(sentimentMatch?.[1] || '0');
    const onChain = parseFloat(onChainMatch?.[1] || '0');

    // Get the last updated time
    const lastUpdatedMatch = html.match(/Last updated: ([^<]+)/);
    const lastUpdated = lastUpdatedMatch?.[1] || new Date().toISOString();

    return {
      score,
      trend: 'neutral',
      components: {
        market,
        sentiment,
        onChain
      },
      lastUpdated
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