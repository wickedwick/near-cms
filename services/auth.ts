import { NextRequest } from "next/server"
import { jwtVerify } from "jose"

export const TOKEN = 'user_token'
export const SECRET = 'hPaRe7NxxtQxrEQrvub4Lqnh8sX2J6j8'

export async function verifyToken(req: NextRequest) {
  const bearer = req.headers.get('authorization')
  if (!bearer) {
    return 'No authorization header'
  }

  const token = bearer.split(' ')[1]

  if (!token) {
    return 'No token'
  }

  try {
    const { payload, protectedHeader } = await jwtVerify(token, new TextEncoder().encode(SECRET))
    console.log('payload', payload)
    console.log('protectedHeader', protectedHeader)

    if (payload) return
    
    return 'Invalid token'
  } catch (err) {
    return 'Invalid token'
  }
}
