import { NextResponse } from 'next/server';

const API_URL = new URL('http://45.76.10.9:3000').toString();

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Content-Type': 'text/html',
      }
    });

    const html = await res.text();
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.error();
  }
} 