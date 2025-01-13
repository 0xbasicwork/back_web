import { NextResponse } from 'next/server';
import { getIndexData } from '@/lib/api';

export async function GET() {
  try {
    const data = await getIndexData();
    
    return NextResponse.json({
      index: data.score,
      market_data: data.components.market,
      social_sentiment: data.components.sentiment,
      onchain_activity: data.components.onChain
    });

  } catch (error) {
    console.error('API Error:', error);
    // Return mock data as fallback if the API fails
    return NextResponse.json({
      index: 47,
      market_data: 59,
      social_sentiment: 35,
      onchain_activity: 43
    });
  }
} 