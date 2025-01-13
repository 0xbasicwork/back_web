import { NextResponse } from 'next/server';
import { getIndexData } from '@/lib/api';

export async function GET() {
  try {
    const data = await getIndexData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    // Return fallback data instead of error
    return NextResponse.json({
      index: 47,
      market_data: 59,
      social_sentiment: 35,
      onchain_activity: 43
    });
  }
} 