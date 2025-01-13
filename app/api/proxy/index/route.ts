import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('http://45.76.10.9:3000', {
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