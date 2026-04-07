import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? `set (${process.env.GOOGLE_CLIENT_ID.length} chars, starts: ${process.env.GOOGLE_CLIENT_ID.substring(0, 10)})` : 'MISSING',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? `set (${process.env.GOOGLE_CLIENT_SECRET.length} chars)` : 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'MISSING',
    AUTH_SECRET: process.env.AUTH_SECRET ? 'set' : 'MISSING',
  })
}
