import { NextResponse } from 'next/server';

const API_URL = 'http://45.76.10.9:3000';

export async function GET() {
  try {
    const res = await fetch(API_URL);
    const html = await res.text();

    const cssLink = html.match(/<link rel="stylesheet" href="(\/css\/styles\.css)">/)?.[1];
    let css = '';
    
    if (cssLink) {
      const cssRes = await fetch(`${API_URL}${cssLink}`);
      css = await cssRes.text();
    }

    return NextResponse.json({ html, css });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
} 