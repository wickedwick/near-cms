import type { NextApiRequest, NextApiResponse } from 'next'
import { SECRET } from '../../services/auth'
import { SignJWT } from 'jose'
import { getServerSideContract } from '../../services/contracts'
import { db } from '../../services/db'
import { TextEncoder } from 'util'
import { Client, UserRole } from '../../assembly/main'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const username = req.headers['client_id'] as string
  const apiKey = req.headers['client_secret'] as string

  if (!username || !apiKey) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  const contract = await getServerSideContract()
  let isUser = true
  let user: UserRole | Client = await contract.getUser({ username })
  
  if (!user) {
    isUser = false
    user = await contract.getClient({ slug: username })
  }

  let storedKey = ''
  if (isUser) {
    db.get(`${username}`).get('apiKey').on(data => {
      storedKey = data
    })
  } else {
    db.get('client').get(`${username}`).get('apiKey').on(data => {
      storedKey = data
    })
  }

  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  if (storedKey !== apiKey) {
    res.status(401).json({ error: 'Invalid API key' })
    return
  }

  const payload: JwtPayload = {
    identifier: username
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('urn:example:issuer')
    .setAudience('urn:example:audience')
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode(SECRET))

  res.status(200).json({ token: 'Bearer ' + token })
}
