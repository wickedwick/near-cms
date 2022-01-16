import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '../../../services/auth'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  
  if (url.href.includes('/api/auth')) {
    return NextResponse.next()
  }

  const payload = await verifyToken(req)

  return typeof payload === 'string'
    ? new Response(JSON.stringify({ message: payload }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    : payload
}
