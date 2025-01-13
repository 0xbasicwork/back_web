import { NextResponse } from 'next/server';

const API_URL = 'http://45.76.10.9:3000/api/history';

interface RawDataPoint {
  timestamp: string;
  score: number;
}

function getDayKey(date: string) {
  return new Date(date).toISOString().split('T')[0];
}

function calculateDailyAverages(data: RawDataPoint[]) {
  const dailyData: { [key: string]: number[] } = {};
  
  // Group scores by day
  data.forEach(point => {
    const dayKey = getDayKey(point.timestamp);
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = [];
    }
    dailyData[dayKey].push(point.score);
  });

  // Calculate average for each day
  return Object.entries(dailyData).map(([date, scores]) => ({
    timestamp: new Date(date).toISOString(),
    value: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const rawData: RawDataPoint[] = await res.json();
    const dailyAverages = calculateDailyAverages(rawData);
    
    console.log('Daily averages:', dailyAverages);

    return NextResponse.json(dailyAverages, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch data' }, 
      { status: 500 }
    );
  }
} 