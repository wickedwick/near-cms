import type { NextApiRequest, NextApiResponse } from 'next'

export function corsMiddleware(req: NextApiRequest, res: NextApiResponse, cors) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}
