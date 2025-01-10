import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://45.76.10.9:3000/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      next: {
        revalidate: 300 // Cache for 5 minutes
      }
    });

    if (!response.ok) {
      console.error('API Response not ok:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // If we're still getting HTML, let's return a mock response for now
    // until we can fix the API connection
    return NextResponse.json({
      index: 48,
      market_data: 62,
      social_sentiment: 35,
      onchain_activity: 43
    });

  } catch (error) {
    console.error('Error in API route:', error);
    // Return mock data as fallback
    return NextResponse.json({
      index: 48,
      market_data: 62,
      social_sentiment: 35,
      onchain_activity: 43
    });
  }
} 